var Item = require("./SequentialList").Item;
var SequentialList = require("./SequentialList").SequentialList;

class UDPBuffer {
    constructor () {
        this._seqList = new SequentialList();
    }
    
    getFirstPacket () {
        let item = this._seqList.getNextSeqItem();
        return item.data;
    }
    setPacket (packet, seq) {
        let item = new Item();
        item.seq = seq;
        item.data = packet;
        if(!this._seqList.putItem(item)) {
            console.log("Drop packet. seq: " + item.seq);
        }

        return true;
    }

    getPacketById (id) {
        let packetSet = [];
        let packet = this.getFirstPacket();

        console.log("SequentialList length before getPacketById: " + this._seqList.length);
        // less the id(parameter) than delete
        while (packet.packetID < id) {
            packet = this.getFirstPacket();
        }
        while(packet.packetID === id) {
            packetSet.push(packet);
            packet = this.getFirstPacket();
        }

        if (packet !== null) {
            this.setPacket(packet, packet.packetSequenceNumber);
        }
        console.log("SequentialList length after getPacketById: " + this._seqList.length);
   
        if (packetSet.length > 0) {
            return packetSet;
        }
        else {
            return null;
        }
    }
}

module.exports = UDPBuffer;