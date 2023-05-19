

export default class Ship {
    constructor(radius = 1, origin = [0, 0, 0]) {
      this.origin = origin;
      //console.log(_generateVertices(radius));
      this._generateVertices();
    }
  
    _generateVertices() {
      let vert = "0 0 1 0 -1 0 -1 0 0 0 0 -1 1 0 0 0 1 0";
      let grid = vert.split(" ");

      const widthSegments = 3;
      const heightSegments = 6;

      this.indices = [];

      for(let i = 0; i < grid.length; i++){
        grid[i] = parseFloat(grid[i]);
      }

      let grid2d = new Array(heightSegments).fill().map(_ => new Array(widthSegments).fill(0));
      console.log(grid2d);
      let indexX = 0;
      for(let i = 0 ; i < grid.length; i+=widthSegments){
        for(let j=0; j<widthSegments; j++){
          grid2d[indexX][j] = grid[i+j];
        }
        indexX++;
      }

      // indices

      // for (let iy = 0; iy < heightSegments; iy++) {
      //   this.indices.push(grid2d[iy][0], grid2d[iy][1], grid2d[iy][2], grid2d[iy][3])
      // }

      this.vertices = [1.000,1.000,1.000,
      1.000,1.000,-1.000,
      1.000,-1.000,1.000,
      1.000,-1.000,-1.000,
      -1.000,1.000,1.000,
      -1.000,1.000,-1.000,
      -1.000,-1.000,1.000,
      -1.000,-1.000,-1.000];

      this.indices = Array.from(Array(this.vertices.length / 3).keys())
    }
  }
  