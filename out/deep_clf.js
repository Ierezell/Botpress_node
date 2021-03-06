"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import * as tf from '@tensorflow/tfjs';
// Load the binding
const tf = require("@tensorflow/tfjs-node");
const Promise = require('bluebird');
class Deep_clf {
    constructor(_embedder, _nb_intent, _embed_size) {
        this._embedder = _embedder;
        this._nb_intent = _nb_intent;
        this._embed_size = _embed_size;
        this._clf = tf.sequential();
        this._clf.add(tf.layers.inputLayer({ inputShape: [_embed_size] }));
        this._clf.add(tf.layers.dense({ units: _embed_size, useBias: true }));
        // this._clf.add(tf.layers.reLU());
        this._clf.add(tf.layers.leakyReLU());
        this._clf.add(tf.layers.dropout({ rate: 0.4 }));
        // this._clf.add(tf.layers.layerNormalization());
        this._clf.add(tf.layers.batchNormalization());
        // this._clf.add(tf.layers.dense({ units: _embed_size, useBias: true }));
        // // this._clf.add(tf.layers.reLU());
        // this._clf.add(tf.layers.leakyReLU());
        // this._clf.add(tf.layers.dropout({ rate: 0.4 }));
        // // this._clf.add(tf.layers.layerNormalization());
        // this._clf.add(tf.layers.batchNormalization());
        // this._clf.add(tf.layers.dense({ units: Math.floor((_embed_size + _nb_intent) / 2), useBias: true }));
        // this._clf.add(tf.layers.leakyReLU());
        // // this._clf.add(tf.layers.reLU());
        // this._clf.add(tf.layers.dropout({ rate: 0.3 }));
        // // this._clf.add(tf.layers.layerNormalization());
        // this._clf.add(tf.layers.batchNormalization());
        this._clf.add(tf.layers.dense({ units: _nb_intent, useBias: true }));
        this._clf.add(tf.layers.softmax());
        this._clf.compile({
            optimizer: tf.train.adam(0.0001),
            loss: tf.losses.softmaxCrossEntropy,
            metrics: ['accuracy']
        });
        // console.log(this._clf.summary())
    }
    async train(X, y) {
        await this._clf.fit(tf.tensor2d(X), tf.oneHot(tf.tensor1d(y, 'int32'), this._nb_intent), {
            batchSize: 512,
            epochs: 200,
            validationSplit: 0.1,
            verbose: 0,
            shuffle: true,
        });
    }
    async predict(sentence) {
        const embed = await this._embedder.getSentenceEmbedding(sentence);
        const tens = tf.tensor1d(embed).reshape([1, this._embed_size]);
        const probs = this._clf.predict(tens).reshape([this._nb_intent]);
        const { values, indices } = tf.topk(probs, 3, true);
        const top_k_values = Array.from(values.dataSync());
        const top_k_indices = Array.from(indices.dataSync());
        const top_k = top_k_indices.map((e, i) => [e, top_k_values[i]]);
        const pred = tf.argMax(probs);
        // pred.print()
        const proba = tf.max(probs);
        // proba.print()
        // console.log(pred, proba)
        return [pred.dataSync()[0], proba.dataSync()[0], top_k];
    }
    save(path) {
        this._clf.save(path);
    }
    load(path) {
        this._clf.load(path);
    }
}
exports.Deep_clf = Deep_clf;
//# sourceMappingURL=deep_clf.js.map