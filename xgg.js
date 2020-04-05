const koa = require('koa')
const chalk = require('chalk')
const {promisify} = require('util')
const figlet = promisify(require('figlet'))
const {initRouter, initController, initService, loadConfig, initSchedule} = require('./xgg-loader')

class Xgg {
    constructor(conf){
        this.$app = new koa(conf)

        //加载配置项
        loadConfig(this)
        initSchedule()
        this.$service = initService()
        this.$ctrl = initController(this)
        this.$router = initRouter(this)
        this.$app.use(this.$router.routes())
    }

    start (port){
        this.$app.listen(port,async ()=>{
            const desc = await figlet('welcome')
            console.log(chalk.green(desc));
            console.log(chalk.green('server running at '+ port));
        })
    }
}

module.exports = Xgg;