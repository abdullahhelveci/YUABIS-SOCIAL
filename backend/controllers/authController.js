const User = require('../models/userModal')
const bcrypt = require('bcrypt')

// register
exports.registerController = async (req,res) => {
   
    
      try {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password,salt)

        const user = await new User({
            username:req.body.username,
            email:req.body.email,
            password:hashedPassword
        })

        await user.save()
        res.status(200).json({message:'başarılı istek',user})
      } catch (error) {
        console.log(error)
      }

}

// login
exports.loginController = async (req,res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
        }

        const validPassword = await bcrypt.compare(req.body.password, user.password);

        if (!validPassword) {
            return res.status(400).json({ message: 'Yanlış şifre' });
        }

        res.status(200).json({ message: 'Login başarılı',user});
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası' });
    }
}