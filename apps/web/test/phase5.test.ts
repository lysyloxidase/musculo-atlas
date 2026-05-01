import { describe, expect, it } from "vitest";
import {
  DEFAULT_ATLAS_STATE,
  LEVEL_ENTRY_ZOOM,
  atlasReducer,
  createAtlasStateFromSearch,
} from "../src/lib/atlasState";
import {
  MOLSTAR_LOAD_TARGET_MS,
  getAtomsForDomain,
  getCpkColor,
  getDomainStructure,
  getMolstarUrl,
  getPdbLoadPlan,
  getProteinStructure,
  getTroponinShiftNm,
  getVdwRadiusAngstrom,
  parsePdbAtoms,
} from "../src/lib/molecular";
import { getZoomLevel } from "../src/lib/zoom";

describe("phase 5 PDB and Molstar integration", () => {
  it("targets Molstar PDB 1TIT with a 3s load budget", () => {
    const url = getMolstarUrl("1TIT");
    const target = getPdbLoadPlan().find((item) => item.id === "1TIT");

    expect(url).toContain("molstar.org/viewer");
    expect(url).toContain("pdb=1TIT");
    expect(target?.timeoutMs).toBeLessThanOrEqual(MOLSTAR_LOAD_TARGET_MS);
    expect(MOLSTAR_LOAD_TARGET_MS).toBeLessThanOrEqual(3000);
  });

  it("provides load targets for all 15+ canonical molecular structures", () => {
    const plan = getPdbLoadPlan();
    const ids = plan.map((target) => target.id);

    expect(plan.length).toBeGreaterThanOrEqual(15);
    for (const pdbId of [
      "2MYS",
      "5N69",
      "8G4L",
      "3MFP",
      "1ATN",
      "5JLH",
      "5NOG",
      "5NOL",
      "5NOJ",
      "6KN8",
      "1TIT",
      "3B43",
      "1YA5",
      "7QIM",
      "4D1E",
      "1SU4",
      "5T15",
    ]) {
      expect(ids).toContain(pdbId);
    }

    expect(plan.every((target) => target.url.startsWith("https://"))).toBe(
      true,
    );
  });
});

describe("phase 5 protein selection flow", () => {
  it("clicking thick filament selects myosin with S1 heads visible", () => {
    const state = atlasReducer(DEFAULT_ATLAS_STATE, {
      filamentId: "myosin_ii",
      type: "select_filament",
    });
    const protein = getProteinStructure(state.selectedProteinId);

    expect(state.selectedNodeId).toBe("myosin_ii");
    expect(state.zoomValue).toBe(LEVEL_ENTRY_ZOOM[9]);
    expect(protein.renderHints.s1Heads).toBe(2);
    expect(protein.pdbIds).toContain("2MYS");
  });

  it("clicking thin filament selects regulated actin with tropomyosin and troponin", () => {
    const state = atlasReducer(DEFAULT_ATLAS_STATE, {
      filamentId: "actin",
      type: "select_filament",
    });
    const protein = getProteinStructure(state.selectedProteinId);

    expect(state.selectedNodeId).toBe("actin");
    expect(protein.components.join(" ")).toContain("tropomyosin");
    expect(protein.components.join(" ")).toContain("troponin");
    expect(protein.pdbIds).toContain("6KN8");
  });

  it("clicking titin selects Ig domains as beads on a string", () => {
    const state = atlasReducer(DEFAULT_ATLAS_STATE, {
      filamentId: "titin",
      type: "select_filament",
    });
    const protein = getProteinStructure(state.selectedProteinId);

    expect(state.selectedNodeId).toBe("titin");
    expect(protein.renderHints.igDomainBeads).toBeGreaterThanOrEqual(12);
    expect(protein.defaultDomainId).toBe("titin_ig_domain");
  });

  it("advances from a protein to atomic domain detail", () => {
    const proteinState = atlasReducer(DEFAULT_ATLAS_STATE, {
      proteinId: "myosin_ii",
      type: "select_protein",
    });
    const domainState = atlasReducer(proteinState, {
      domainId: "myosin_s1_motor",
      type: "select_domain",
    });

    expect(getZoomLevel(proteinState.zoomValue)).toBe(9);
    expect(domainState.selectedNodeId).toBe("myosin_s1_motor");
    expect(domainState.selectedProteinId).toBe("myosin_ii");
    expect(getZoomLevel(domainState.zoomValue)).toBe(10);
  });
});

describe("phase 5 atomic rendering semantics", () => {
  it("shows residue-level detail in the titin Ig domain", () => {
    const domain = getDomainStructure("titin_ig_domain");
    const atoms = getAtomsForDomain("titin_ig_domain");

    expect(domain.pdbId).toBe("1TIT");
    expect(domain.residues).toBe(89);
    expect(domain.secondaryStructure).toContain("A");
    expect(domain.secondaryStructure).toContain("G");
    expect(atoms.length).toBeGreaterThan(20);
    expect(atoms.some((atom) => atom.residueIndex === 89)).toBe(true);
  });

  it("uses CPK colors and Van der Waals radii for custom R3F atoms", () => {
    expect(getCpkColor("C")).toBe("#8c8c8c");
    expect(getCpkColor("N")).toBe("#4d8dff");
    expect(getCpkColor("O")).toBe("#ee4f4f");
    expect(getCpkColor("S")).toBe("#d7b95d");
    expect(getVdwRadiusAngstrom("C")).toBe(1.7);
    expect(getVdwRadiusAngstrom("N")).toBe(1.55);
    expect(getVdwRadiusAngstrom("O")).toBe(1.52);
  });

  it("parses PDB ATOM lines into custom atom records", () => {
    const atoms = parsePdbAtoms(
      "ATOM      1  N   VAL A   1      11.104  13.207   8.111  1.00 20.00           N\n" +
        "ATOM      2  CA  VAL A   1      12.001  12.112   8.500  1.00 20.00           C",
    );

    expect(atoms).toHaveLength(2);
    expect(atoms[0]).toMatchObject({
      chain: "A",
      element: "N",
      residue: "VAL",
      residueIndex: 1,
    });
  });

  it("animates troponin calcium states by shifting tropomyosin B to C to M", () => {
    const blocked = getTroponinShiftNm("blocked");
    const closed = getTroponinShiftNm("closed");
    const open = getTroponinShiftNm("open");

    expect(blocked).toBeLessThan(closed);
    expect(closed).toBeLessThan(open);

    const state = atlasReducer(DEFAULT_ATLAS_STATE, {
      state: "open",
      type: "set_troponin_state",
    });

    expect(state.troponinState).toBe("open");
  });

  it("toggles molecular surface, cartoon, ball-and-stick, and Molstar modes", () => {
    let state = DEFAULT_ATLAS_STATE;

    for (const mode of [
      "molstar",
      "surface",
      "cartoon",
      "ball_and_stick",
    ] as const) {
      state = atlasReducer(state, {
        mode,
        type: "set_molecular_render_mode",
      });
      expect(state.molecularRenderMode).toBe(mode);
    }
  });

  it("deep-links directly to Level 10 molecular domain state", () => {
    const state = createAtlasStateFromSearch(
      "?zoom=0.96&protein=titin&domain=titin_ig_domain&mode=ball_and_stick&troponin=open",
    );

    expect(getZoomLevel(state.zoomValue)).toBe(10);
    expect(state.selectedProteinId).toBe("titin");
    expect(state.selectedDomainId).toBe("titin_ig_domain");
    expect(state.selectedNodeId).toBe("titin_ig_domain");
    expect(state.molecularRenderMode).toBe("ball_and_stick");
    expect(state.troponinState).toBe("open");
  });
});
