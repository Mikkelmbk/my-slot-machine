auth.onAuthStateChanged((user) => {
	if (user == null) {

	} else {
		db.collection("users")
			.doc(auth.currentUser.uid)
			.get()
			.then(function (snapshot) {
				let data = snapshot.data();

				let username = document.querySelector('.names__name');
				username.textContent = data.fullname;

				let profileImage = document.querySelector('.profile-image__image');
				profileImage.setAttribute('src', data.imagePath);

				let bannerImage = document.querySelector('.banner__img');
				bannerImage.setAttribute('src', data.bannerPath);
			});
	}
});

//===========================================================================================================
// Upload profile billede


let submitProfilePicOnKeyUp = document.querySelector('#profile-image__file-input')
submitProfilePicOnKeyUp.addEventListener('change', () => {
	let form = document.querySelector('.profile-image__upload');
	let imageName = form.image.files[0].name;
	var uploadTask = storage.child(`images/profilePicture/` + imageName).put(form.image.files[0]);

	// Register three observers:
	// 1. 'state_changed' observer, called any time the state changes
	// 2. Error observer, called on failure
	// 3. Completion observer, called on successful completion
	uploadTask.on('state_changed', function (snapshot) {
		// Observe state change events such as progress, pause, and resume
		// Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
		var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
		console.log('Upload is ' + progress + '% done');
		switch (snapshot.state) {
			case firebase.storage.TaskState.PAUSED: // or 'paused'
				console.log('Upload is paused');
				break;
			case firebase.storage.TaskState.RUNNING: // or 'running'
				console.log('Upload is running');
				break;
		}
	}, function (error) {
		// Handle unsuccessful uploads
	}, function () {
		// Handle successful uploads on complete
		// For instance, get the download URL: https://firebasestorage.googleapis.com/...
		uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
			console.log('File available at', downloadURL);
			db.collection("users")
				.doc(auth.currentUser.uid)
				.update({
					imageName: imageName,
					imagePath: downloadURL,
				})
			let profileImage = document.querySelector('.profile-image__image');
			profileImage.setAttribute('src', downloadURL);
		});
	});
});

//===========================================================================================================
// Upload banner


let submitBannerOnKeyUp = document.querySelector('#banner__file-input')
submitBannerOnKeyUp.addEventListener('change', () => {
	let form = document.querySelector('.banner__form');
	let imageName = form.image.files[0].name;
	var uploadTask = storage.child(`images/profilebanner/` + imageName).put(form.image.files[0]);

	// Register three observers:
	// 1. 'state_changed' observer, called any time the state changes
	// 2. Error observer, called on failure
	// 3. Completion observer, called on successful completion
	uploadTask.on('state_changed', function (snapshot) {
		// Observe state change events such as progress, pause, and resume
		// Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
		var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
		console.log('Upload is ' + progress + '% done');
		switch (snapshot.state) {
			case firebase.storage.TaskState.PAUSED: // or 'paused'
				console.log('Upload is paused');
				break;
			case firebase.storage.TaskState.RUNNING: // or 'running'
				console.log('Upload is running');
				break;
		}
	}, function (error) {
		// Handle unsuccessful uploads
	}, function () {
		// Handle successful uploads on complete
		// For instance, get the download URL: https://firebasestorage.googleapis.com/...
		uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
			console.log('File available at', downloadURL);
			db.collection("users")
				.doc(auth.currentUser.uid)
				.update({
					bannerName: imageName,
					bannerPath: downloadURL,
				})
				let bannerImage = document.querySelector('.banner__img');
				bannerImage.setAttribute('src', downloadURL);
		});
	});
});