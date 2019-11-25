const fs = require('fs')

function form_data_model(file_name) {
  let file_dir = './Data/' + file_name;
  var st = fs.readFileSync(file_dir, 'UTF8');
  var data_arr = st.split('\r\n')
  var Point = { x: 0, y: 0, z: 0, Cube_x: 0, Cube_y: 0, Cube_z: 0, Cube_id: 0 }
  var Points = {
    all_points: []
  };
  for (var i = 1; i < data_arr.length - 1; i++) { // Добавление координат точек в документ Points
    var temp_point = Object.assign({}, Point);
    [temp_point.x, temp_point.y, temp_point.z] = [Number.parseFloat(data_arr[i].split(' ')[0]), Number.parseFloat(data_arr[i].split(' ')[1]), Number.parseFloat(data_arr[i].split(' ')[2])]
    Points.all_points.push(temp_point);
  }

  var arr_x = []; var arr_y = []; var arr_z = []; // Нахождение длины стороны самого большого куба
  for (var i = 1; i < data_arr.length - 1; i++) {
    arr_x.push(Number.parseFloat(data_arr[i].split(' ')[0]));
    arr_y.push(Number.parseFloat(data_arr[i].split(' ')[1]));
    arr_z.push(Number.parseFloat(data_arr[i].split(' ')[2]));
  }
  var max_x = Math.max.apply(null, arr_x); var min_x = Math.min.apply(null, arr_x);
  var max_dif_x = Math.max.apply(null, [Math.abs(max_x), Math.abs(min_x)]);

  var max_y = Math.max.apply(null, arr_y); var min_y = Math.min.apply(null, arr_y);
  var max_dif_y = Math.max.apply(null, [Math.abs(max_y), Math.abs(min_y)]);

  var max_z = Math.max.apply(null, arr_z); var min_z = Math.min.apply(null, arr_z);
  var max_dif_z = Math.max.apply(null, [Math.abs(max_z), Math.abs(min_z)]);

  var unit = Math.max.apply(null, [max_dif_x, max_dif_y, max_dif_z]);
  var large_cube_side = 2*unit; // Длина стороны самого большого куба
  var big_cube_side = Number.parseFloat((large_cube_side/2.4662120743).toFixed(9))
  var smaller_cube_side = Number.parseFloat((big_cube_side/2.4662120743).toFixed(9));
  var smallest_cube_side = Number.parseFloat((smaller_cube_side/2.4662120743).toFixed(9));
  // console.log("Large Cube side: " + large_cube_side);
  // console.log("Big Cube side: " + big_cube_side);
  // console.log("Smaller Cube side: " + smaller_cube_side);
  // console.log("Smallest Cube side: " + smallest_cube_side);

  form_cubes(smallest_cube_side, smaller_cube_side, big_cube_side, unit, Points); // Функция для формирования коллекции кубов наименьшего размера
}

function form_cubes(smallest, smaller, big, unit, Points) {
  var Boundry_Cube = { // Координаты большого куба, в который входят все точки
    LUF: [unit, -unit, unit], // Левый верхний угол передней грани {x, y, z}
    LDF: [unit, -unit, -unit], // Левый нижний угол передней грани {x, y, z}
    RDF: [unit, unit, -unit], // Правый нижний угол передней грани {x, y, z}
    RUF: [unit, unit, unit], // Правый верхний угол передней грани {x, y, z}
    LUB: [-unit, -unit, unit], // Левый верхний угол задней грани {x, y, z}
    LDB: [-unit, -unit, -unit], // Левый нижний угол задней грани {x, y, z}
    RDB: [-unit, unit, -unit], // Правый нижний угол задней грани {x, y, z}
    RUB: [-unit, unit, unit] // Правый верхний угол задней грани {x, y, z}
  }
  //console.log(Boundry_Cube);
  var Cube = {
    Cube_id: 0,
    Neib_cube: [],
    center_number: 0
  }
  var Cubes = {
    all_cubes: []
  };

  for (var i = 0; i < 15; i++) { // Заполнение id всех кубов (Cube_id = "Nx_Ny_Nz", где Ni-число кубов смещения от LDB координат вдоль оси i)
    for (var j = 0; j < 15; j++) {
      for (var k = 0; k < 15; k++) {
        var temp_cube = Object.assign({}, Cube);
        temp_cube.Cube_id = i + '_' + j + '_' + k;
        Cubes.all_cubes.push(temp_cube);
      }
    }
  }
  //console.log(Cubes);
  var id = [0,0,0];
  for (var i = 0; i < Points.all_points.length; i++) { // Заполнение координат и id наименьших кубов для каждой точки
    id = [Math.trunc((Points.all_points[i].x + unit)/smallest), Math.trunc((Points.all_points[i].y + unit)/smallest), Math.trunc((Points.all_points[i].z + unit)/smallest)];
    Points.all_points[i].Cube_id = id.join('_');
    [Points.all_points[i].Cube_x, Points.all_points[i].Cube_y,
    Points.all_points[i].Cube_z] = [id[0]*smallest + smallest/2 - unit, id[1]*smallest + smallest/2 - unit, id[2]*smallest + smallest/2 - unit];

    //console.log(Points.all_points[i]);
  }
}

module.exports = {
  form_data_model: form_data_model
}
