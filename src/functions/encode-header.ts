import { TEncodeHeaderFunction } from '../types';
import { computeMaximumDataChunkSize } from './compute-maximum-data-chunk-size.macro' with { type: 'macro' };
import { textAsUint32 } from './text-as-uint32.macro' with { type: 'macro' };

export const encodeHeader: TEncodeHeaderFunction = (dataView, bitRate, numberOfChannels, numberOfSamples, sampleRate) => {
    const bytesPerSample = 4; // 32-bit floating point wave file
    // TODO: Unnecessary to calculate bitsPerSample for floating point wave files...
    // TODO: Unnecessary to use bitRate variable, at all.
    const bitsPerSample = bytesPerSample > 0 ? bytesPerSample * 8 : bitRate / numberOfChannels;
    const dataChunkSize = Math.min(numberOfSamples * numberOfChannels * bytesPerSample, computeMaximumDataChunkSize(44));

    dataView.setUint32(0, textAsUint32('RIFF'));
    dataView.setUint32(4, dataChunkSize + 38, true); // We need to EXCLUDE the 4 bytes for the "RIFF" identifier and these 4 bytes for the chunk length.
    dataView.setUint32(8, textAsUint32('WAVE'));
    dataView.setUint32(12, textAsUint32('fmt '));
    dataView.setUint32(16, 18, true); // We need 2 more bytes for the header extension.
    dataView.setUint16(20, 3, true); // WAVE_FORMAT_IEEE_FLOAT 32-bit
    dataView.setUint16(22, numberOfChannels, true);
    dataView.setUint32(24, sampleRate, true);
    dataView.setUint32(28, sampleRate * numberOfChannels * bytesPerSample, true);
    dataView.setUint16(32, numberOfChannels * bytesPerSample, true);
    dataView.setUint16(34, bitsPerSample, true);
    dataView.setUint16(36, 0, true); // Header extension size is 0.
    dataView.setUint32(38, textAsUint32('data'));
    dataView.setUint32(42, dataChunkSize, true);
};
