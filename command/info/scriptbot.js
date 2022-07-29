module.exports = {
	name: "scriptbot",
	alias: ["script", "sc", "scbot"],
	category: "info",
	isSpam: true,
	async run({ msg, conn }, { q, map, args }) {
		await conn.sendMessage(
			msg.from,
			{
				image: { url: config.thumb },
				footer:`${conn.user.name} © ${new Date().getFullYear()}`,
				// Gausah di ubah kontol najis modal copas sana sini ubah source cih
				caption: `Script Bot Is here\ndon't forget fork + star XD`,
				templateButtons: [
					{ urlButton: { displayText: "Script Bot", url: "https://github.com/RizzyDev81/rizz-multidevice/" } },
				],
			},
			{ quoted: msg }
		);
	},
};