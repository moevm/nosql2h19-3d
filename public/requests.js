window.onload = async () => {
    let response = await fetch('/acquire_collection_name', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }

    });

    let result = await response.json();
    document.getElementById('current_collection').value = result.name;

    console.log(result);

};
