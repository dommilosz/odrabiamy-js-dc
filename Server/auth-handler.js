webserver = require("./webserver.js");
server = webserver.server;
hashes_arr = {
	validhashes: [],
	lastupdated: [],
	users: [],
};
module.exports.emitter = null;
module.exports.backemitter = null;
module.exports.password = "";

server.get("/auth", function (req, res) {
	params = webserver.GetParams(req);
	if (params.username && params.username.trim() != "") {
		if (params.password && params.password == module.exports.password) {
			r = AddHash(params.username);
			res.writeHead("200", { "Content-Type": "text/json" });
			res.write(r);
			res.end();
		} else {
			res.writeHead("403", { "Content-Type": "text/json" });
			res.write("INVALID PASSWORD");
            res.end();
            console.log(
                `"${params.username}" tried to enter invalid password "${params.password}".`
            );
		}
	} else {
		res.writeHead("403", { "Content-Type": "text/json" });
		res.write("INVALID USERNAME (IT CAN BE ANYTHING)");
        res.end();
        
	}
});

function AddHash(username) {
	var ts = Math.round(new Date().getTime() / 1000);
	r1 = Math.random().toString(36).substring(7);
	r2 = Math.random().toString(36).substring(7);
	r3 = Math.random().toString(36).substring(7);
	r4 = Math.random().toString(36).substring(7);
	r = r1 + r2 + r3 + r4;
	console.log("hash : ", r, "  Username : ", username);

	hashes_arr.validhashes.push(r);
	hashes_arr.users.push(username);
	hashes_arr.lastupdated.push(ts);
	return r;
}
function CheckHash(hash, username) {
	var ts = Math.round(new Date().getTime() / 1000);
	if (hashes_arr.validhashes.includes(hash)) {
		i = hashes_arr.validhashes.indexOf(hash);
		if (hashes_arr.users[i] != username) {
			console.log(
				`Validating hash "${hash}" for username "${username}". INVALID : USERNAME DOESN'T MATCH`
			);
			return false;
		}
		updated = ts - hashes_arr.lastupdated[i];
		if (updated < 60) {
			console.log(
				`Validating hash "${hash}" for username "${username}". VALID`
			);
			return true;
		} else {
			console.log(
				`Validating hash "${hash}" for username "${username}". INVALID : EXPIRED`
			);
			return false;
		}
	} else {
		console.log(
			`Validating hash "${hash}" for username "${username}". INVALID : HASH NOT FOUND`
		);
		return false;
	}
}
function UpdateHash(hash, username) {
	var ts = Math.round(new Date().getTime() / 1000);
	if (CheckHash(hash, username)) {
		i = hashes_arr.validhashes.indexOf(hash);
		hashes_arr.lastupdated[i] = ts;
		return true;
	}
	return false;
}
module.exports.CheckHash = function (hash, username) {
	return UpdateHash(hash, username);
};
