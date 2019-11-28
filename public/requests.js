window.onload = async () => {
    let response = await fetch('/acquire_collection_name', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }

    });

    let result = await response.json();

    document.getElementById('current_collection').value = result.name;

   await fetch('/insert_collection', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }
    }).then(data => console.log(data));


};
