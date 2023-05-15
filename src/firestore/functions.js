import firestore from '@react-native-firebase/firestore';

export const addSample = () => {
    const usersCollection = firestore().collection('Users').add({
        name: 'Ada Lovelace',
        age: 30,
    })
        .then(() => {
            console.log('User added!');
        });
    // console.log("UsersCollection: ", usersCollection);
    // console.log("AddSample");
}

export const addNewCompany = (compName) => {
    firestore().collection('Companies').add({
        "Company Name": compName,
    }).then(() => {
        console.log("Added New Company: ", compName);
    })
}

// export const getCompany = async () => {

//     const allCompanies = await firestore().collection('Companies').get().then(snap => {
//         // snap.docs.map((item) => console.log("Item: ", item._data["Company Name"]));
//     })
//     return allCompanies;

// }
