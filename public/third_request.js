window.onload = async () => {
  var number = document.getElementById('numb_dots').value;
  var coordinates = document.getElementById('coords').value;

  let body = {
    numb: number,
    coords: coordinates
  };
  let response = await fetch('/db_third_request', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(body)

  });

  let result = await response.json();
  var ol = document.createElement("ul");
  var div = document.getElementById('main_div');

  if (result.length > 15) {
    for (var i = 0; i < 15; i++) {
      let li = document.createElement('li');
      li.innerHTML = '<p>' + JSON.stringify(result[i]).replace('_id', 'ID куба').replace('distance', 'Расстояние') + '</p>';
      ol.append(li);
    }
    let li = document.createElement('li');
    li.innerHTML = '<p> ... </p>';
    ol.append(li);
  }
  else {
    for (var i = 0; i < result.length; i++) {
      let li = document.createElement('li');
      li.innerHTML = '<p>' + JSON.stringify(result[i]).replace('_id', 'ID куба').replace('distance', 'Расстояние') + '</p>';
      ol.append(li);
    }
  }
  div.append(ol)
}
