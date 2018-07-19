
export default class Mask {
    static BLUR1 = [
        [0.0, 0.2,  0.0],
        [0.2, 0.2,  0.2],
        [0.0, 0.2,  0.0]
    ];
    static BLUR1_FACTOR = 1.0;
    static BLUR1_BIAS = 0.0;

    static BLUR2 = [
        [0, 0, 1, 0, 0],
        [0, 1, 1, 1, 0],
        [1, 1, 1, 1, 1],
        [0, 1, 1, 1, 0],
        [0, 0, 1, 0, 0]
    ];
    static BLUR2_FACTOR = 1.0 / 13.0;
    static BLUR2_BIAS = 0.0;

    static MOTION_BLUR = [
        [1, 0, 0, 0, 0],
        [0, 1, 0, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 0, 1, 0],
        [0, 0, 0, 0, 1]
    ];
    static MOTION_BLUR_FACTOR = 1.0 / 7.0;
    static MOTION_BLUR_BIAS = 0.0;

    static FIND_HORIZONTAL_EDGES = [
        [0,  0,  0,  0,  0],
        [0,  0,  0,  0,  0],
        [-1, -1,  2,  0,  0],
        [0,  0,  0,  0,  0],
        [0,  0,  0,  0,  0]
    ];
    static FIND_HORIZONTAL_EDGES_FACTOR = 1.0;
    static FIND_HORIZONTAL_EDGES_BIAS = 0.0;

    static FIND_VERTICAL_EDGES = [
        [0,  0, -1,  0,  0],
        [0,  0, -1,  0,  0],
        [0,  0,  4,  0,  0],
        [0,  0, -1,  0,  0],
        [0,  0, -1,  0,  0]
    ];
    static FIND_VERTICAL_EDGES_FACTOR = 1.0;
    static FIND_VERTICAL_EDGES_BIAS = 0.0;

    static FIND_45_DEGREE_EDGES = [
        [-1,  0,  0,  0,  0],
        [0, -2,  0,  0,  0],
        [0,  0,  6,  0,  0],
        [0,  0,  0, -2,  0],
        [0,  0,  0,  0, -1]
    ];
    static FIND_45_DEGREE_EDGES_FACTOR = 1.0;
    static FIND_45_DEGREE_EDGES_BIAS = 0.0;

    static FIND_ALL_EDGES = [
        [-1, -1, -1],
        [-1,  8, -1],
        [-1, -1, -1]
    ];
    static FIND_ALL_EDGES_FACTOR = 1.0;
    static FIND_ALL_EDGES_BIAS = 0.0;

    static SHARPEN1 = [
        [-1, -1, -1],
        [-1,  9, -1],
        [-1, -1, -1]
    ];
    static SHARPEN1_FACTOR = 1.0;
    static SHARPEN1_BIAS = 0.0;

    static SHARPEN2 = [
        [-1, -1, -1, -1, -1],
        [-1,  2,  2,  2, -1],
        [-1,  2,  8,  2, -1],
        [-1,  2,  2,  2, -1],
        [-1, -1, -1, -1, -1]
    ];
    static SHARPEN2_FACTOR = 1.0 / 8.0;
    static SHARPEN2_BIAS = 0.0;

    static EDGES = [
        [1,  1,  1],
        [1, -7,  1],
        [1,  1,  1]
    ];
    static EDGES_FACTOR = 1.0;
    static EDGES_BIAS = 0.0;

    static EMBOSS1 = [
        [-1, -1,  0],
        [-1,  0,  1],
        [0,  1,  1]
    ];
    static EMBOSS1_FACTOR = 1.0;
    static EMBOSS1_BIAS = 128.0;

    static EMBOSS2 = [
        [-1, -1, -1, -1,  0],
        [-1, -1, -1,  0,  1],
        [-1, -1,  0,  1,  1],
        [-1,  0,  1,  1,  1],
        [0,  1,  1,  1,  1]
    ];
    static EMBOSS2_FACTOR = 1.0;
    static EMBOSS2_BIAS = 128.0;

    static MEAN = [
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1]
    ];
    static MEAN_FACTOR = 1.0 / 9.0;
    static MEAN_BIAS = 0.0;

}
