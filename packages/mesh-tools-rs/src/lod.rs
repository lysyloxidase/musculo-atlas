#[derive(Clone, Copy, Debug, PartialEq)]
pub struct LodLevel {
    pub name: &'static str,
    pub ratio: f32,
}

pub const DEFAULT_LODS: [LodLevel; 3] = [
    LodLevel {
        name: "lod0",
        ratio: 1.0,
    },
    LodLevel {
        name: "lod1",
        ratio: 0.5,
    },
    LodLevel {
        name: "lod2",
        ratio: 0.2,
    },
];

pub fn lod_for_distance(distance_meters: f32) -> LodLevel {
    if distance_meters < 0.5 {
        DEFAULT_LODS[0]
    } else if distance_meters < 2.0 {
        DEFAULT_LODS[1]
    } else {
        DEFAULT_LODS[2]
    }
}
