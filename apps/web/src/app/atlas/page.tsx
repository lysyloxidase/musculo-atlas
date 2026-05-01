import BreadcrumbNav from "@/components/ui/BreadcrumbNav";
import InfoPanel from "@/components/ui/InfoPanel";
import LegendPanel from "@/components/ui/LegendPanel";
import SearchOverlay from "@/components/ui/SearchOverlay";
import ZoomIndicator from "@/components/ui/ZoomIndicator";
import AtlasCanvas from "@/components/viewer/AtlasCanvas";

export default function AtlasPage() {
  return (
    <main className="atlas-shell">
      <div className="atlas-topbar">
        <BreadcrumbNav nodeId="titin_ig_domain" />
        <SearchOverlay />
      </div>
      <section className="atlas-stage" aria-label="MusculoAtlas viewer">
        <AtlasCanvas />
        <ZoomIndicator zoomValue={0.5} />
      </section>
      <aside className="atlas-side">
        <InfoPanel nodeId="rectus_femoris_sarcomere" />
        <LegendPanel />
      </aside>
    </main>
  );
}
