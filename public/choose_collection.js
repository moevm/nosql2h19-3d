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
            let list = document.getElementById('choose_coll_ul');
            data.forEach(item => {
                const li = document.createElement('li', );
                li.innerHTML = "<button type='button' class='coll_but'>" + item +"</button>";
                console.log(list);
                list.append(li);
            })

        });

    document.querySelectorAll('.coll_but').forEach(item => {
        item.addEventListener('click', async () => {
            let name = item.textContent;
            let body = {
                name
            };
            let response = await fetch('/save_chosen_collection_name', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(body)
            });

            let result = await response.json();
            console.log(result);
            document.location.href = '/requests1';
        });
    });

};