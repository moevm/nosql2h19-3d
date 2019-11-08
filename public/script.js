window.onload = () => {

    document.querySelector('#create-new-collection')
        .addEventListener('click', async e => {
            let name = document.querySelector('#collection-name-input').value;
            console.log(name)

            let body = {
                name
            };

            let response = await fetch('/add-new-collection', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(body)
            });

            let result = await response.json();
            console.log(result);



        });



};
