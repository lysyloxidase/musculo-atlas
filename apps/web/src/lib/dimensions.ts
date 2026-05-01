import type { ZoomLevel } from "./types";

/**
 * Canonical biological dimensions for every zoom level.
 * Phase-1 values come from the project research brief and include provenance
 * strings that point at the literature category used for validation.
 */
export const LEVEL_DIMENSIONS = {
  L1_BODY: {
    scale_m: 1.7,
    bones: 206,
    muscles: 700,
    muscle_mass_pct_female: 30,
    muscle_mass_pct_male: 40,
    source:
      "Gray's Anatomy adult skeletal count; Janssen et al. 2000 skeletal muscle mass estimates",
  },
  L2_SYSTEM: {
    appendicular_skeleton_bones: 126,
    axial_skeleton_bones: 80,
    source: "Gray's Anatomy adult axial and appendicular skeletal counts",
  },
  L3_REGION: {
    compartments: [
      "anterior_thigh",
      "posterior_thigh",
      "medial_thigh",
      "anterior_leg",
      "lateral_leg",
      "posterior_leg",
      "anterior_arm",
      "posterior_arm",
      "anterior_forearm",
      "posterior_forearm",
      "gluteal",
      "abdominal_wall",
      "back",
    ],
    source: "Standring, Gray's Anatomy regional compartment organization",
  },
  L4_MUSCLE: {
    example_muscles: {
      biceps_femoris_lh: { fiber_len_cm: 10.9, pcsa_cm2: 6.6, penn_deg: 0 },
      gluteus_maximus: { fiber_len_cm: 14.2, pcsa_cm2: 26.8, penn_deg: 5 },
      rectus_femoris: { fiber_len_cm: 6.6, pcsa_cm2: 12.5, penn_deg: 5 },
      soleus: { fiber_len_cm: 4.0, pcsa_cm2: 58.0, penn_deg: 25 },
      vastus_lateralis: { fiber_len_cm: 6.5, pcsa_cm2: 28.6, penn_deg: 5 },
    },
    fiber_length_range_cm: [1, 30],
    pennation_angle_range_deg: [0, 30],
    source: "Ward et al. 2009 lower-limb architectural properties",
  },
  L5_FASCICLE: {
    connective_tissue: "perimysium (2-layer crossed wavy collagen honeycomb)",
    diameter_um: [50, 300],
    fibers_per_fascicle: [10, 100],
    length_mm: 10,
    source: "Gillies and Lieber 2011 skeletal muscle extracellular matrix",
  },
  L6_FIBER: {
    diameter_um: [10, 100],
    length_cm: [0.1, 30],
    mitochondria_volume_pct: { type_I: 6, type_IIa: 4.5, type_IIx: 2.3 },
    myofibrils_per_fiber: [100, 2000],
    nuclei_count: [100, 1000],
    sarcolemma_thickness_nm: 7.5,
    satellite_cell_pct_nuclei: 1,
    t_tubule_lumen_nm: [30, 40],
    source:
      "Lieber 2010 skeletal muscle structure; Schiaffino and Reggiani 2011 fiber types",
  },
  L7_MYOFIBRIL: {
    a_band_width_um: 1.6,
    diameter_um: [1, 2],
    i_band_width_um: 0.4,
    source: "Huxley 1969 myofibril ultrastructure and A-band geometry",
  },
  L8_SARCOMERE: {
    actins_per_thin: 360,
    crown_spacing_nm: 14.33,
    h_zone_width_um: 0.2,
    m_line_width_nm: 75,
    myosins_per_thick: 294,
    resting_length_um: [2.0, 2.5],
    thick_filament_diameter_nm: 15,
    thick_filament_length_um: 1.65,
    thick_helix_repeat_nm: 43,
    thin_actin_repeat_nm: 37,
    thin_filament_diameter_nm: 7,
    thin_filament_length_um: 1.0,
    titin_length_um: 1.0,
    titins_per_thick: 6,
    z_disc_thickness_nm: [30, 120],
    source:
      "Squire 1997 muscle filament lattice; Huxley 1957 sliding filament model",
  },
  L9_PROTEIN: {
    actin: {
      g_actin_mass_kda: 42,
      helical_repeat_nm: 37,
      pdb_ids: ["3MFP", "1ATN", "6KN8"],
      subunit_rise_nm: 2.75,
    },
    alpha_actinin_2: {
      dimer_mass_kda: 200,
      pdb_ids: ["4D1E"],
    },
    desmin: { mass_kda: 53 },
    dystrophin: { mass_kda: 427 },
    myosin_II: {
      mass_kda: 520,
      mhc_mass_kda: 225,
      pdb_ids: ["2MYS", "5N69", "8G4L", "1BR1", "3I5G"],
      s1_head_nm: [16.5, 6.5, 4],
      tail_length_nm: 150,
    },
    nebulin: {
      mass_kda: [600, 900],
      pdb_ids: ["7QIM"],
    },
    ryr1: { mass_mda: 2.2, pdb_ids: ["5T15", "7M6L"] },
    serca: { pdb_ids: ["1SU4", "3TLM"] },
    titin: {
      ig_domain_mass_kda: 10,
      ig_domain_size_nm: 4,
      ig_domains_a_band: 112,
      ig_domains_i_band: 150,
      length_um: 1.0,
      mass_mda: [3.0, 3.7],
      pdb_ids: ["1TIT", "1TIU", "3B43", "1YA5"],
    },
    troponin: {
      pdb_ids: ["6KN8", "6KLN"],
      tnc_mass_kda: 18,
      tni_mass_kda: 24,
      tnt_mass_kda: 37,
    },
    tropomyosin: {
      dimer_mass_kda: 66,
      length_nm: 40,
      pdb_ids: ["5JLH", "5NOG", "5NOL"],
    },
    source: "RCSB PDB structural biology records and UniProt reviewed entries",
  },
  L10_DOMAIN: {
    actin_subdomains: {
      domains: ["SD1_outer", "SD2_DNase_loop", "SD3_inner", "SD4"],
      nucleotide_cleft: "between SD2 and SD4",
      pdb: "1ATN",
    },
    atomic_resolution_m: 1e-10,
    ig_domain_titin: {
      fold: "beta_sandwich_7_strands",
      pdb: "1TIT",
      residues: 89,
      size_nm: [4, 2.5, 2],
      unfolding_force_pN: [150, 300],
    },
    myosin_s1_motor: {
      lever_arm: "IQ_motif + ELC + RLC",
      pdb: "2MYS",
      subdomains: [
        "25kDa_upper",
        "50kDa_upper",
        "50kDa_lower",
        "20kDa_converter",
      ],
    },
    source:
      "RCSB PDB atomic coordinate structures and titin Ig domain force spectroscopy",
  },
} as const;

export const LEVEL_SCALE_METERS: Record<ZoomLevel, number> = {
  1: 1.7,
  2: 1.0,
  3: 0.45,
  4: 0.06,
  5: 0.01,
  6: 0.0001,
  7: 0.000002,
  8: 0.0000024,
  9: 0.00000001,
  10: 0.0000000001,
};

export const LEVEL_NAMES: Record<ZoomLevel, string> = {
  1: "Body",
  2: "System",
  3: "Region",
  4: "Muscle",
  5: "Fascicle",
  6: "Fiber",
  7: "Myofibril",
  8: "Sarcomere",
  9: "Protein",
  10: "Domain",
};
