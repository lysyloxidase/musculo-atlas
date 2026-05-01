use crate::Vertex;

pub fn stride_decimate(vertices: &[Vertex], ratio: f32) -> Vec<Vertex> {
    assert!(ratio > 0.0 && ratio <= 1.0, "ratio must be in (0, 1]");
    if vertices.is_empty() || ratio == 1.0 {
        return vertices.to_vec();
    }

    let stride = (1.0 / ratio).round().max(1.0) as usize;
    vertices.iter().step_by(stride).copied().collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn decimates_by_stride() {
        let vertices = (0..10)
            .map(|n| Vertex::new(n as f32, 0.0, 0.0))
            .collect::<Vec<_>>();

        let reduced = stride_decimate(&vertices, 0.5);

        assert_eq!(reduced.len(), 5);
        assert_eq!(reduced[1], Vertex::new(2.0, 0.0, 0.0));
    }
}
