import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ColorService {

  constructor(private http: HttpClient) {
    const list = this.http.get<any>("../../../../assets/colorlist.json")
    list.subscribe((data: any) => {
      data.forEach((item: any, index: number) => {
        this.colorList.set(item.hex, item.name)
        // if(index < 3){
        //   console.log(item.name + ": " + item.hex)
        // }
      })
    }) 
   }

   colorList: Map<string, string> = new Map()

  matchColorName(hex: string): string {
  hex = hex.toUpperCase()
  // console.log('checking ' + hex)
  // console.log(this.colorList.has(hex) ? "true" : "false")
  if(this.colorList.has(hex)){
    return this.colorList.get(hex)!
  }

  else {
    return this.nearestColor(hex);
  }
  }

  nearestColor(hex: string): string {
    let c1: number[] = this.hexToNumChunks(hex);
    let minimumDistance: number = 9999;
    let closestColor: string = "";

    // save distance
    this.colorList.forEach((name: string, hex2: string) => {
      let c2: number[] = this.hexToNumChunks(hex2);
      let distance = Math.sqrt(Math.pow((c2[0] - c1[0]), 2) + Math.pow((c2[1] - c1[1]), 2) + Math.pow((c2[2] - c1[2]), 2))
      //console.log("checking vs " + hex + ":" + name + " | " + hex2 + " = " + distance);

      if(distance < minimumDistance){
        minimumDistance = distance;
        closestColor = name;
        // console.log(closestColor + ": " + distance);
      }
    })

    return closestColor
  }

  checkEuclideanDistance(hex: string, hex2: string): number {
    let c1 = this.hexToNumChunks(hex);
    let c2 = this.hexToNumChunks(hex2);

    let reds = c2[0] - c1[0]
    let greens = c2[1] - c1[1]
    let blues = c2[2] - c1[2]

    console.log("reds: " + c2[0] + " - " + c1[0] + " = " + reds)
    console.log("greens: " + c2[1] + " - " + c1[1] + " = " + greens)
    console.log("blues: " + c2[2] + " - " + c1[2] + " = " + blues)

    console.log("red^2: " + Math.pow(reds, 2))
    console.log("green^2: " + Math.pow(greens, 2))
    console.log("blue^2: " + Math.pow(blues, 2))

    let distance = Math.sqrt(Math.pow(reds, 2) + Math.pow(greens, 2) + Math.pow(blues, 2))
    return distance
  }

  hexToNumChunks(hex: string): number[] {
    let chunk = [];
    let numchunk: number[] = [];

    for(let i = 1; i < hex.length; i += 2) {
      chunk.push(hex.substring(i, i + 2))
    }

    chunk.forEach((chunk: string) => {
      numchunk.push(parseInt(chunk, 16))
    })

    return numchunk
  }


}
