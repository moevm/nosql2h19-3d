window.onload = async () => {
//
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
        await fetch('/get_stats', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(body)
        }).then(result => result.json())
            .then(data => {
                console.log(data);
                document.getElementById('pointinp').value = data.points;
                document.getElementById('cubeinp').value = data.cubes;
            });

    }




};