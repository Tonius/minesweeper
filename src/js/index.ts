import {Map} from 'immutable';


let map = Map({foo: 'bar', wie: 'die'});
let map2 = map.set('wat', 'foobar');

console.log(map.toObject(), map2.toObject());
