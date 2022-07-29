let express = require("express");
let path = require("path");
let fs = require("fs");
const linkGrupRegex = /chat.whatsapp.com\/([0-9A-Za-z]{20,24})/i;
const regNum = /[^0-9]/gi;
const setting = require("./config.json");

async function connect(conn, PORT, state) {
	// conn.connectOptions.logQR = false
	let app = (global.app = express());
	let _qr = "invalid";
	app.set("json spaces", 2);

	app.use(async (req, res, next) => {
		if (state !== "open") return res.status(503).send();
		next();
	});
	app.get("/", async (req, res, next) => {
		if (state == "open")
			return res.status(200).send({
				status: 200,
				message: "Bot Telah Tersambung ke whatsapp web anda!",
				user: conn.user,
			});
	});
	app.get("/sendtxt/:jid", async (req, res, next) => {
		let { jid } = req.params;
		let { text } = req.query;
		if (!text) return res.sendStatus(400);
		try {
			jid = jid.replace(regNum, "") + "@s.whatsapp.net";
			let [resf] = await conn.onWhatsApp(jid);
			if (!resf) return res.status(500).send({ message: "Invalid Jid User" });
			let { key } = await conn.sendMessage(jid, {
				text: `*Send Message From API*\n\n${text}`,
			});
			res.status(200).send({ message: "Success Sent Msg", key });
		} catch (e) {
			res.status(500).send({ message: e.message });
		}
	});

	app.get("/joinbot", async (req, res, next) => {
		try {
			const { url: q } = req.query;
			if (!linkGrupRegex.test(q)) return res.status(400).send({ status: 400, message: "Invalid Group Invite" });
			var [h, link] = linkGrupRegex.exec(q);
			var detek = await conn.inviteInfo(q);
			if (parseInt(detek.size) <= 500)
				return res.status(403).send({
					status: 403,
					message: `bots can only join if the group is sorry if the group is more than 500`,
				});
			var gcid = await conn.groupAcceptInvite(link);
			res.status(200).send({ status: 200, message: "Success Joined!" });
		} catch (e) {
			res.status(500).send({ status: 500, message: e.message || e });
		}
	});
	app.use((req, res) => res.status(404).send(""));

	let server = app.listen(PORT, () => console.log("App running on", "http://localhost:" + PORT));
}

module.exports = connect;
