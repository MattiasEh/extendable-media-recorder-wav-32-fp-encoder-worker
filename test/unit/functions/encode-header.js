import { encodeHeader } from '../../../src/functions/encode-header';

describe('encodeHeader()', () => {

    let bitRate;
    let dataView;
    let numberOfChannels;
    let numberOfSamples;
    let sampleRate;

    beforeEach(() => {
        bitRate = 16;
        dataView = new DataView(new ArrayBuffer(44));
        numberOfChannels = 2;
        numberOfSamples = 100;
        sampleRate = 48000;
    });

    it('should encode a header with the given parameters', () => {
        encodeHeader(dataView, bitRate, numberOfChannels, numberOfSamples, sampleRate);

        expect(dataView.getUint32(0)).to.equal(1380533830);
        expect(dataView.getUint32(4, true)).to.equal(numberOfSamples * numberOfChannels * (bitRate >> 3) + 36);
        expect(dataView.getUint32(8)).to.equal(1463899717);
        expect(dataView.getUint32(12)).to.equal(1718449184);
        expect(dataView.getUint32(16, true)).to.equal(16);
        expect(dataView.getUint16(20, true)).to.equal(1);
        expect(dataView.getUint16(22, true)).to.equal(numberOfChannels);
        expect(dataView.getUint32(24, true)).to.equal(sampleRate);
        expect(dataView.getUint32(28, true)).to.equal(sampleRate * numberOfChannels * (bitRate >> 3));
        expect(dataView.getUint16(32, true)).to.equal(numberOfChannels * (bitRate >> 3));
        expect(dataView.getUint16(34, true)).to.equal(bitRate);
        expect(dataView.getUint32(36)).to.equal(1684108385);
        expect(dataView.getUint32(40, true)).to.equal(numberOfSamples * numberOfChannels * (bitRate >> 3));
    });

});
