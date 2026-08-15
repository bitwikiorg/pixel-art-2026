const assert = require('assert');
const b = require('../assets/js/binary-carrier.js');

const checker = b.preset('checker');
assert.equal(checker.length, 256);

const bytes = b.bitsToBytes(checker);
assert.equal(bytes.length, 32);
assert.deepEqual(Array.from(b.bytesToBits(bytes, 256)), Array.from(checker));
assert.equal(b.crcHex(new Uint8Array([1, 2, 3])), '55BC801D');

const textBits = b.textToCarrier('HELLO PIXEL');
assert.equal(b.carrierToText(textBits), 'HELLO PIXEL');

const encoded = b.hamming74Encode(checker);
assert.equal(encoded.length, 448);
const oneFlip = Uint8Array.from(encoded);
oneFlip[10] ^= 1;
const decoded = b.hamming74Decode(oneFlip);
assert.equal(b.hammingDistance(checker, decoded.bits), 0);

const frame = b.preset('frame');
const codec = b.motifCodec(frame);
assert.equal(b.hammingDistance(frame, b.motifDecode(codec)), 0);

const hv = b.buildFieldHypervector(b.preset('smile'));
assert.equal(hv.length, 4096);
const query = b.hypervectorQuery(hv, 4, 4);
assert.ok(Number.isFinite(query.score0));
assert.ok(Number.isFinite(query.score1));

const memory = b.makeHopfield();
const smile = b.preset('smile');
assert.equal(memory.store(smile), true);
let corrupted = Uint8Array.from(smile);
for (let i = 0; i < 12; i++) corrupted[i] ^= 1;
for (let k = 0; k < 8; k++) corrupted = memory.recallStep(corrupted);
assert.ok(b.hammingDistance(smile, corrupted) <= 12);

console.log('binary-carrier smoke test passed');