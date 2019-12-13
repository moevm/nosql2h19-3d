const fs = require('fs')

function form_data_model(file_name) {
  let file_dir = './Data/' + file_name;
  var st = fs.readFileSync(file_dir, 'UTF8');
  var data_arr = st.split('\n')
  var Point = { x: 0, y: 0, z: 0, Cube_x: 0, Cube_y: 0, Cube_z: 0, Cube_id: 0 } // Объявление документов
  var Points = { all_points: [] };
  var Cubes = { all_cubes: [] };

  for (var i = 1; i < data_arr.length - 1; i++) { // Добавление координат точек в документ Points
    var temp_point = Object.assign({}, Point);
    [temp_point.x, temp_point.y, temp_point.z] = [Number.parseFloat(data_arr[i].split(' ')[0]), Number.parseFloat(data_arr[i].split(' ')[1]), Number.parseFloat(data_arr[i].split(' ')[2])]
    Points.all_points.push(temp_point);
  }

  var arr_full = []; // Нахождение длины стороны самого большого куба
  for (var i = 1; i < data_arr.length - 1; i++) { // Заполнение массива точками
    arr_full.push(Number.parseFloat(data_arr[i].split(' ')[0]));
    arr_full.push(Number.parseFloat(data_arr[i].split(' ')[1]));
    arr_full.push(Number.parseFloat(data_arr[i].split(' ')[2]));
  }
  var unit = Math.max.apply(null, arr_full.map(Math.abs));
  var large_cube_side = 2*unit; // Длина стороны самого большого куба
  var big_cube_side = Number.parseFloat((large_cube_side/3).toFixed(9))
  var smaller_cube_side = Number.parseFloat((big_cube_side/3).toFixed(9));
  var smallest_cube_side = Number.parseFloat((smaller_cube_side/3).toFixed(9)); // Длина стороны самого маленького куба

  Points = form_points(smallest_cube_side, unit, Points); // Заполняем документ Points
  Cubes = form_cubes(smallest_cube_side, unit, Cubes); // Заполняем документ Cubes

  var New_collection = { // Формирование новой коллекции по исходным данным
    Points: Points,
    Cubes: Cubes
  }
  return [New_collection, smallest_cube_side]
}

function form_points(smallest, unit, Points) { // Функция, формирующая документ точек (Points)
  var id = [0,0,0];
  for (var i = 0; i < Points.all_points.length; i++) { // Заполнение координат и id наименьших кубов для каждой точки
    id = [Math.trunc((Points.all_points[i].x + unit)/smallest), Math.trunc((Points.all_points[i].y + unit)/smallest), Math.trunc((Points.all_points[i].z + unit)/smallest)];
    Points.all_points[i].Cube_id = id.join('_');
    [Points.all_points[i].Cube_x, Points.all_points[i].Cube_y,
    Points.all_points[i].Cube_z] = [Number.parseFloat((id[0]*smallest + smallest/2 - unit).toFixed(9)), Number.parseFloat((id[1]*smallest + smallest/2 - unit).toFixed(9)), Number.parseFloat((id[2]*smallest + smallest/2 - unit).toFixed(9))];
  }
  return Points
}

function form_cubes(smallest, unit, Cubes) { // Функция, формирующая документ кубов (Cubes)
  var Cube = { Cube_id: 0, Neib_cube: [], center_number: 0 }
  var Boundry_Cube = { // Координаты самого большого куба, в который входят все точки
    LUF: [unit, -unit, unit], // Левый верхний угол передней грани {x, y, z}
    LDF: [unit, -unit, -unit], // Левый нижний угол передней грани {x, y, z}
    RDF: [unit, unit, -unit], // Правый нижний угол передней грани {x, y, z}
    RUF: [unit, unit, unit], // Правый верхний угол передней грани {x, y, z}
    LUB: [-unit, -unit, unit], // Левый верхний угол задней грани {x, y, z}
    LDB: [-unit, -unit, -unit], // Левый нижний угол задней грани {x, y, z}
    RDB: [-unit, unit, -unit], // Правый нижний угол задней грани {x, y, z}
    RUB: [-unit, unit, unit] // Правый верхний угол задней грани {x, y, z}
  } // Эта штука не используется, нужна только для простоты понимания кода

  for (var i = 0; i < 27; i++) { // Заполнение id всех наименьших кубов (Cube_id = "Nx_Ny_Nz", где Ni-число кубов смещения от LDB координат вдоль оси i)
    for (var j = 0; j < 27; j++) {
      for (var k = 0; k < 27; k++) {
        var temp_cube = Object.assign({}, Cube);
        temp_cube.Cube_id = k + '_' + j + '_' + i;
        Cubes.all_cubes.push(temp_cube);
      }
    }
  }

  var temp_cube = Cube;
  var cube_id = [0, 0, 0];
  for (var i = 0; i < Cubes.all_cubes.length; i++) { // Заполнение списка соседей для каждого наименьшего куба
    var temp_cube = Object.assign({}, Cubes.all_cubes[i])
    cube_id = [Number.parseInt(Cubes.all_cubes[i].Cube_id.split('_')[0]), Number.parseInt(Cubes.all_cubes[i].Cube_id.split('_')[1]), Number.parseInt(Cubes.all_cubes[i].Cube_id.split('_')[2])]
    Cubes.all_cubes[i].Neib_cube = find_neighbours(cube_id);
  }

  for (var i = 0; i < Cubes.all_cubes.length; i++) { // Заполнение параметра center_number для каждого наименьшего куба
    var temp_cube = Object.assign({}, Cubes.all_cubes[i])
    cube_id = [Number.parseInt(Cubes.all_cubes[i].Cube_id.split('_')[0]), Number.parseInt(Cubes.all_cubes[i].Cube_id.split('_')[1]), Number.parseInt(Cubes.all_cubes[i].Cube_id.split('_')[2])]
    if (isInteger((cube_id[0] - 1)/3) && isInteger((cube_id[1] - 1)/3) && isInteger((cube_id[2] - 1)/3))
      Cubes.all_cubes[i].center_number = 1; // куб является центром маленького куба
    if (isInteger((cube_id[0] - 4)/9) && isInteger((cube_id[1] - 4)/9) && isInteger((cube_id[2] - 4)/9))
      Cubes.all_cubes[i].center_number = 2; // куб является центром большого куба
    if (cube_id[0] == 13 && cube_id[1] == 13 && cube_id[2] == 13)
      Cubes.all_cubes[i].center_number = 3; // куб является центром самого большого куба
  }

  return Cubes
}

function isInteger(num) { // Вспомогательная функция для проверки, является ли заданное число целым
  return (num ^ 0) === num;
}

function find_neighbours(coord_arr) { // Функция, формирующая массив соседей для заданных координат
  var arr_diff = []; var neib_arr = [];
  for (var i = -1; i < 2; i++) // Формирование массива всех возможных единичных отклонений
    for (var j = -1; j < 2; j++)
      for (var k = -1; k < 2; k++)
        if (!(i == 0 && j == 0 && k == 0))
          arr_diff.push([i, j, k])

  var check = 0; // Переменная для проверки корректности всех координат соседей
  for (var i = 0; i < arr_diff.length; i++) {
    neib_arr.push(arr_diff[i]);
    for (var j = 0; j < arr_diff[i].length; j++) {
      var temp_arr = Object.assign({}, arr_diff[i]);
      neib_arr[neib_arr.length - 1][j] = arr_diff[i][j] + coord_arr[j];
      if (temp_arr[j] + coord_arr[j] >= 0 && temp_arr[j] + coord_arr[j] <= 26) // Должны быть в пределах от 0 до 26
        check++;
    }
    if (check != 3)
      neib_arr.pop();
    check = 0;
  }
  return neib_arr;
}

module.exports = { form_data_model: form_data_model };
