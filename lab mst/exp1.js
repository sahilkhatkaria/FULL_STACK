const fetchData = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("Data fetched successfully");
    }, 2000);
});

fetchData
    .then((message) => {
        console.log(message);
    })
    .catch((error) => {
        console.log(error);
    });
