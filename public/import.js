window.onload = () => {

    document.querySelector('#import_apply')
        .addEventListener('click', async e => {
            let name = document.querySelector('#import_input').value;
            let body = {
                name
            };

            let response = await fetch('/import_dbase', {
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