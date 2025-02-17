import { TEncodeFactory } from '../types';

export const createEncode: TEncodeFactory = (computeNumberOfSamples, encodeHeader) => {
    return (channelDataArrays, part, bitRate, sampleRate) => {
        const bytesPerSample = 4; // 32-bit floating point wave file
        const headerSize = part === 'subsequent' ? 0 : 46;
        const numberOfChannels = channelDataArrays.length;
        const numberOfSamples = computeNumberOfSamples(channelDataArrays[0]);
        const arrayBuffer = new ArrayBuffer(numberOfSamples * numberOfChannels * bytesPerSample + headerSize);
        const dataView = new DataView(arrayBuffer);

        if (part !== 'subsequent') {
            encodeHeader(dataView, bitRate, numberOfChannels, part === 'complete' ? numberOfSamples : Number.POSITIVE_INFINITY, sampleRate);
        }

        channelDataArrays.forEach((channel, index) => {
            let offset = headerSize + index * bytesPerSample;

            channel.forEach((channelDataArray) => {
                const length = channelDataArray.length;

                for (let i = 0; i < length; i += 1) {
                    const value = channelDataArray[i];

                    dataView.setFloat32(offset, value, true);

                    offset += numberOfChannels * bytesPerSample;
                }
            });
        });

        return [arrayBuffer];
    };
};
