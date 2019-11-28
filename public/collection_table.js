window.onload = async () => {
    await fetch('/list_collections', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }
    }).then(result => result.json())
        .then(data => {
            console.log(data);
            let list = document.getElementById('selector');
            data.forEach(item => {
                list.options[list.options.length] = new Option(item, item);
            })

        });
    let selector = document.getElementById('selector')
    selector.onchange = async () => {
        let name = selector.value;
        let body = {name};
        var responce = await fetch('/get_stats', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(body)
          });
        if (responce.ok) {
          data = await responce.json();
          console.log(data);
          document.getElementById('pointinp').value = data.points;
          document.getElementById('cubeinp').value = data.cubes;
          document.getElementById('cubesize').value = data.cubesize;
        }
        else {
          alert(responce.status)
        }
        // }).then(result => result.json())
        //     .then(data => {
        //         console.log(data);

        //     });

    }




};
