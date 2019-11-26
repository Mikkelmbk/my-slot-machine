auth.onAuthStateChanged(function (user) {
	if (user != null) {
		db.collection("users")
			.get()
			.then(function (snapshot) {
				snapshot.docs.forEach(function (doc) {
					let data = doc.data();

				});
			});

	} else {

	}
});