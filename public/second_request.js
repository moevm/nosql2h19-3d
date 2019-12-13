window.onload = async () => {
  var name = document.getElementById('data').value;
  let body = {
      name
  };
  let response = await fetch('/db_second_request', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(body)

  });

  let result = await response.json();
  var ol = document.createElement("ul");
  var div = document.getElementById('main_div');
  var end = ''; var len = result.length + '';
  if (len[len.length - 1] == 1)
    end = ' куб';
  if (len[len.length - 1] < 5 && len[len.length - 1] > 1)
    end = ' куба';
  if (len[len.length - 1] >= 5 || len[len.length - 1] == 0)
    end = ' кубов';

  if (result.length > 15) {
    for (var i = 0; i < 15; i++) {
      let li = document.createElement('li');
      li.innerHTML = '<p>' + JSON.stringify(result[i]).replace('_id', 'ID куба').replace('count', 'Количество точек') + '</p>';
      ol.append(li);
    }
    let li = document.createElement('li');
    li.innerHTML = '<p> ... </p>';
    ol.append(li);
  }
  else {
    for (var i = 0; i < result.length; i++) {
      let li = document.createElement('li');
      li.innerHTML = '<p>' + JSON.stringify(result[i]).replace('_id', 'ID куба').replace('count', 'Количество точек') + '</p>';
      ol.append(li);
    }
  }

  let li = document.createElement('li');
  li.innerHTML = '<p> Всего ' + result.length + end + ' </p>';
  ol.append(li);

  div.append(ol)
}
