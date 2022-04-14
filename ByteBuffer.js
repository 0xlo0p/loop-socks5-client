class ByteBuffer {
    constructor(size) {
        if(!size)
            this.buffer = undefined
        else
            this.buffer = Buffer.alloc(size * 10)
        this.mode = 'big'
        this.read_pos = 0
        this.write_pos = 0
        this.debug = false;
    }

    putByte(b) {
        this.buffer.writeUInt8(b, this.write_pos)
        this.write_pos++
        if (this.debug) {
            console.log(this.buffer.subarray(0, this.write_pos).toString('hex'))
        }
    }

    putArray(arr) {
        for (let a of arr) {
            this.buffer.writeUInt8(a)
            this.write_pos++
        }
        if (this.debug) {
            console.log(this.buffer.subarray(0, this.write_pos).toString('hex'))
        }
    }

    putShort(s) {
        this.mode === 'big' ? this.buffer.writeUInt16BE(s, this.write_pos) : this.buffer.writeUInt16LE(s, this.write_pos)
        this.write_pos += 2
        if (this.debug) {
            console.log(this.buffer.subarray(0, this.write_pos).toString('hex'))
        }
    }

    putInt(i) {
        this.mode === 'big' ? this.buffer.writeUInt32BE(i, this.write_pos) : this.buffer.writeUInt32LE(i, this.write_pos)
        this.write_pos += 4
        if (this.debug) {
            console.log(this.buffer.subarray(0, this.write_pos).toString('hex'))
        }
    }

    putLong(l) {
        this.mode === 'big' ? this.buffer.writeBigUInt64BE(l, this.write_pos) : this.buffer.writeBigUInt64LE(l, this.write_pos)
        this.write_pos += 8
        if (this.debug) {
            console.log(this.buffer.subarray(0, this.write_pos).toString('hex'))
        }
    }

    putBuffer(b) {
        b.copy(this.buffer, this.write_pos)
        this.write_pos += b.length
        if (this.debug) {
            console.log(this.buffer.subarray(0, this.write_pos).toString('hex'))
        }
    }

    get_write_pos() {
        return this.write_pos

    }

    mark_write_pos(pos) {
        this.write_pos = pos

    }

    get_read_pos() {
        return this.read_pos
    }

    mark_read_pos(pos) {
        this.read_pos = pos
    }

    getByte() {

        let b = this.buffer.readUInt8(this.read_pos)
        this.read_pos++

        return b
    }

    getShort() {
        let s = this.mode === 'big' ? this.buffer.readUInt16BE(this.read_pos) : this.buffer.readUInt16LE(this.read_pos)
        this.read_pos += 2

        return s
    }

    getInt() {
        let i = this.mode === 'big' ? this.buffer.readUInt32BE(this.read_pos) : this.buffer.readUInt32LE(this.read_pos)
        this.read_pos += 4

        return i
    }

    getLong() {
        let l = this.mode === 'big' ? this.buffer.readBigUInt64BE(this.read_pos) : this.buffer.readBigUInt64LE(this.read_pos)
        this.read_pos += 8

        return l
    }

    getBytes(len) {

        let buffer = this.buffer.subarray(this.read_pos, this.read_pos + len)

        this.read_pos += len

        return buffer
    }

    wrap(buffer) {
        this.buffer = buffer
        this.read_pos = 0
        this.write_pos = 0
        console.log(this.buffer.toString('hex'))
    }

    setMode(m) {
        this.mode = m

    }

    putInt2(i) {
        this.buffer.writeUInt8((i >> 8) & 255, this.write_pos)
        this.buffer.writeUInt8((i >> 0) & 255, this.write_pos + 1)
        this.write_pos += 2
        if (this.debug) {
            console.log(this.buffer.subarray(0, this.write_pos).toString('hex'))
        }
    }

    getInt2() {
        let i1 = this.buffer.readUInt8(this.read_pos) & 255
        let n = 0
        let temp = 0
        let mask = 255
        n <<= 8
        temp = i1 & mask
        n |= temp
        let i2 = this.buffer.readUInt8(this.read_pos + 1)
        n <<= 8
        temp = i2 & mask
        n |= temp
        this.read_pos += 2

        return n
    }

    putLong2(l) {
        let temp = l;
        let b = Buffer.alloc(2)
        for (let i = 0; i < b.length; i++) {
            b[(b.length - 1) - i] = 255 & temp
            temp >>= 8
        }
        b.copy(this.buffer, this.write_pos)
        if (this.debug) {
            console.log(this.buffer.subarray(0, this.write_pos).toString('hex'))
        }
        this.write_pos += 2
    }

    getLong2() {
        let temp = 0
        let n = 0
        for (let i = 0; i < 2; i++) {
            n <<= 8
            temp = this.buffer.readUInt8(this.read_pos) & 255
            n |= temp
            this.read_pos++
        }

        return n
    }

    putLong4(l) {
        let temp = l
        let b = Buffer.alloc(4)
        for (let i = 0; i < b.length; i++) {
            b[(b.length - 1) - i] = 255 & temp
            temp >>= 8
        }
        b.copy(this.buffer, this.write_pos)
        this.write_pos += 4
        if (this.debug) {
            console.log(this.buffer.subarray(0, this.write_pos).toString('hex'))
        }
    }

    getLong4() {
        let temp = 0
        let n = 0
        for (let i = 0; i < 4; i++) {
            n <<= 8
            temp = this.buffer.readUInt8(this.read_pos) & 255
            n |= temp
            this.read_pos++
        }
        return n
    }

    getBuffer() {
        return this.buffer.subarray(0, this.write_pos)
    }

    putString(s) {
        let b = Buffer.from(s)
        b.copy(this.buffer, this.write_pos)
        this.write_pos += s.length
        if (this.debug) {
            console.log(this.buffer.subarray(0, this.write_pos).toString('hex'))
        }
    }

    putHex(h) {
        let b = Buffer.from(h, 'hex')
        b.copy(this.buffer, this.write_pos)
        this.write_pos += (h.length / 2)
        if (this.debug) {
            console.log(this.buffer.subarray(0, this.write_pos).toString('hex'))
        }
    }
}

module.exports = ByteBuffer
