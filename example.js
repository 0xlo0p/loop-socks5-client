const loopSocks5 = require('./loop-socsk5.js')



function on_connect(){
    console.log('[socks-client]: on_connect')
    client.write(Buffer.from('GET /cityjson HTTP/1.1\r\nHost: pv.sohu.com\r\n\r\n'))
}
function on_msg(data){

    console.log('[socks-client]: receive '+data.toString('utf-8'))
}
function on_error(err){
    console.error('[socks-client]: on_error '+err)
}
function on_disconnect(had_error){
    console.error('[socks-client]: on_disconnect '+had_error)
}
let client = new loopSocks5(on_connect,on_msg,on_error,on_disconnect)
client.createConnection({
    proxy_host:'127.0.0.1',
    proxy_port:3055,
    proxy_user:'a',
    proxy_pwd:'b',
    target_domain:'pv.sohu.com',
    target_port:80
})
