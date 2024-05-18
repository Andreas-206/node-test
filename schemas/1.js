export const addAvatar = async (req, res, next) => {
	try {
		if (!req.file) {
			throw HttpError(400, 'Avatar not uploaded')
		}

		const { _id } = req.user
		const { path: filePath, filename } = req.file

		const image = await Jimp.read(filePath)
		image.resize(250, 250).write(filePath)

		const resultDir = `public/avatars/${filename}`
		await fs.rename(filePath, resultDir)

		const avatarURL = `/avatars/${filename}`
		await User.findByIdAndUpdate(_id, { avatarURL })

		res.json({ avatarURL })
	} catch (error) {
		next(error)
	}
}

authRouter.patch('/avatars', authorization, upload.single('avatar'), addAvatar)
