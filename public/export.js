window.onload = () => {

    document.querySelector('#export_apply')
        .addEventListener('click', async e => {
            let name = document.querySelector('#export_input').value;
            let body = {
                name
            };

            let response = await fetch('/export_dbase', {
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