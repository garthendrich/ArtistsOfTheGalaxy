import Entity from "./Entity.js";
import { getRandomNumber } from "../helpers/Randomizer.js";
import MovableEntity from "./MovableEntity.js";

export default class Collectibles extends Entity {

  
  
  constructor(length = 1, origin) {
    super(origin);

    const [indices, vertices] = this._generateVertices(length);
    
    this.selectedBehavior = this._generateBehavior();
    this.attribute = this._generateAttribute();
    this.setIndices(indices);
    this.setVertices(vertices);
  }

  _generateVertices(length) {
    
    const vertices = [
        0,0,0,1,
        length,0,0,1,
        0,0,length,1,
        length,0,length,1,

        0,-length,0,1,
        length,-length,0,1,
        0,-length,length,1,
        length,-length,length,1,
    ];
    const indices = [

        // TOP FACE TRIANGLES
        1,2,3,
        2,3,4,

        // BOTTOM FACE TRIANGLES
        5,6,7,
        6,7,8,

        // LEFT FACE TRIANGLES
        5,7,1,
        7,1,3,

        // RIGHT FACE TRIANGLES
        2,6,8,
        8,2,4,

        // FRONT FACE TRIANGLES
        1,5,6,
        6,1,2,

        // BACK FACE TRIANGLES
        3,7,8,
        8,3,4,
    ];

    return [indices, vertices];
  }

  _selectItemFromArray(array, min, max){
    let index = getRandomNumber(min,max);

    return array[index];
  }

  _generateBehavior(){
    const behaviors = [
        "SPEED", "COLOR", "SIZE"
    ];

    return _selectItemFromArray(behaviors, 0,3);
  }

  _generateColor(){
    const colors = [
        [0,0,1], // BLUE
        [0,1,0], // GREEN
        [1,0,0], // RED
    ];

    return _selectItemFromArray(colors, 0,3);
  }

  _generateSpeed(){
    const speeds = [

    ];

    return _selectItemFromArray(speeds, 0,3);
  }

  _generateSize(){

    // bullet sizes
    const sizes = [

    ];

    return _selectItemFromArray(sizes, 0,3);
  }

  _generateAttribute(){
    switch(this.selectedBehavior){
        case "SPEED":
            return this._generateSpeed;
        case "COLOR":
            return this._generateColor;
        case "SIZE":
            return this._generateSize;
    }
  }

//   Will load texture depending on the type of the collectible (SPEED, COLOR, SIZE);
//   _loadTexture(){}

// _generateTextureVertices(){}

}
