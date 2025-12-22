let wasm;

const heap = new Array(128).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

const cachedTextDecoder = (typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }) : { decode: () => { throw Error('TextDecoder not available') } } );

if (typeof TextDecoder !== 'undefined') { cachedTextDecoder.decode(); };

let cachedUint8ArrayMemory0 = null;

function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        wasm.__wbindgen_export_0(addHeapObject(e));
    }
}

function dropObject(idx) {
    if (idx < 132) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

let WASM_VECTOR_LEN = 0;

const cachedTextEncoder = (typeof TextEncoder !== 'undefined' ? new TextEncoder('utf-8') : { encode: () => { throw Error('TextEncoder not available') } } );

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachedDataViewMemory0 = null;

function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

const CLOSURE_DTORS = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(state => {
    wasm.__wbindgen_export_3.get(state.dtor)(state.a, state.b)
});

function makeClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {
        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        try {
            return f(state.a, state.b, ...args);
        } finally {
            if (--state.cnt === 0) {
                wasm.__wbindgen_export_3.get(state.dtor)(state.a, state.b);
                state.a = 0;
                CLOSURE_DTORS.unregister(state);
            }
        }
    };
    real.original = state;
    CLOSURE_DTORS.register(real, state, state);
    return real;
}

function makeMutClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {
        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        } finally {
            if (--state.cnt === 0) {
                wasm.__wbindgen_export_3.get(state.dtor)(a, state.b);
                CLOSURE_DTORS.unregister(state);
            } else {
                state.a = a;
            }
        }
    };
    real.original = state;
    CLOSURE_DTORS.register(real, state, state);
    return real;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches && builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
}

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1, 1) >>> 0;
    getUint8ArrayMemory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}
/**
 * Returns the gas limit for the client for the next calls.
 * @returns {bigint}
 */
export function gas() {
    const ret = wasm.gas();
    return BigInt.asUintN(64, ret);
}

/**
 * Sets the gas limit for the client for the next calls.
 * @param {bigint} gas
 */
export function setGas(gas) {
    wasm.setGas(gas);
}

/**
 * Returns the default payment amount for transactions.
 * @returns {bigint}
 */
export function DEFAULT_PAYMENT_AMOUNT() {
    const ret = wasm.DEFAULT_PAYMENT_AMOUNT();
    return BigInt.asUintN(64, ret);
}

function getArrayJsValueFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    const mem = getDataViewMemory0();
    const result = [];
    for (let i = ptr; i < ptr + 4 * len; i += 4) {
        result.push(takeObject(mem.getUint32(i, true)));
    }
    return result;
}
/**
 * @returns {AccountInfo}
 */
export function getCurrentAccount() {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.getCurrentAccount(retptr);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return AccountInfo.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

let stack_pointer = 128;

function addBorrowedObject(obj) {
    if (stack_pointer == 1) throw new Error('out of js stack');
    heap[--stack_pointer] = obj;
    return stack_pointer;
}

export function run() {
    wasm.run();
}

function __wbg_adapter_38(arg0, arg1, arg2, arg3) {
    wasm.__wbindgen_export_5(arg0, arg1, addHeapObject(arg2), addHeapObject(arg3));
}

function __wbg_adapter_41(arg0, arg1) {
    wasm.__wbindgen_export_6(arg0, arg1);
}

function __wbg_adapter_44(arg0, arg1, arg2) {
    wasm.__wbindgen_export_7(arg0, arg1, addHeapObject(arg2));
}

function __wbg_adapter_47(arg0, arg1) {
    wasm.__wbindgen_export_8(arg0, arg1);
}

function __wbg_adapter_50(arg0, arg1, arg2) {
    wasm.__wbindgen_export_9(arg0, arg1, addHeapObject(arg2));
}

function __wbg_adapter_671(arg0, arg1, arg2, arg3) {
    wasm.__wbindgen_export_10(arg0, arg1, addHeapObject(arg2), addHeapObject(arg3));
}

/**
 * @enum {20002 | 20001 | 60003 | 60002 | 60001 | 20003 | 20000 | 20004}
 */
export const FaucetableWcsprErrors = Object.freeze({
    /**
     * The caller is not the new owner.
     */
    CallerNotTheNewOwner: 20002, "20002": "CallerNotTheNewOwner",
    /**
     * The caller is not the owner.
     */
    CallerNotTheOwner: 20001, "20001": "CallerNotTheOwner",
    /**
     * The user cannot target themselves.
     */
    CannotTargetSelfUser: 60003, "60003": "CannotTargetSelfUser",
    /**
     * Spender does not have enough allowance approved.
     */
    InsufficientAllowance: 60002, "60002": "InsufficientAllowance",
    /**
     * Spender does not have enough balance.
     */
    InsufficientBalance: 60001, "60001": "InsufficientBalance",
    /**
     * The role is missing.
     */
    MissingRole: 20003, "20003": "MissingRole",
    /**
     * The owner is not set.
     */
    OwnerNotSet: 20000, "20000": "OwnerNotSet",
    /**
     * The role cannot be renounced for another address.
     */
    RoleRenounceForAnotherAddress: 20004, "20004": "RoleRenounceForAnotherAddress",
});
/**
 * @enum {0 | 1}
 */
export const LongOrShort = Object.freeze({
    Long: 0, "0": "Long",
    Short: 1, "1": "Short",
});
/**
 * @enum {20002 | 20001 | 8001 | 8004 | 8006 | 8008 | 8010 | 20003 | 8003 | 8002 | 20000 | 21000 | 8011 | 20004 | 8007 | 8009 | 8005 | 8401 | 21001}
 */
export const MarketErrors = Object.freeze({
    /**
     * The caller is not the new owner.
     */
    CallerNotTheNewOwner: 20002, "20002": "CallerNotTheNewOwner",
    /**
     * The caller is not the owner.
     */
    CallerNotTheOwner: 20001, "20001": "CallerNotTheOwner",
    LastPriceNotSet: 8001, "8001": "LastPriceNotSet",
    LongShareNotSet: 8004, "8004": "LongShareNotSet",
    LongTokenContractNotACallerOnDeposit: 8006, "8006": "LongTokenContractNotACallerOnDeposit",
    LongTokenContractNotACallerOnWithdrawal: 8008, "8008": "LongTokenContractNotACallerOnWithdrawal",
    Misconfigured: 8010, "8010": "Misconfigured",
    /**
     * The role is missing.
     */
    MissingRole: 20003, "20003": "MissingRole",
    NewPriceIsFromTheFuture: 8003, "8003": "NewPriceIsFromTheFuture",
    NewPriceIsTooOld: 8002, "8002": "NewPriceIsTooOld",
    /**
     * The owner is not set.
     */
    OwnerNotSet: 20000, "20000": "OwnerNotSet",
    /**
     * Contract needs to be paused first.
     */
    PausedRequired: 21000, "21000": "PausedRequired",
    PriceFeedError: 8011, "8011": "PriceFeedError",
    /**
     * The role cannot be renounced for another address.
     */
    RoleRenounceForAnotherAddress: 20004, "20004": "RoleRenounceForAnotherAddress",
    ShortTokenContractNotACallerOnDeposit: 8007, "8007": "ShortTokenContractNotACallerOnDeposit",
    ShortTokenContractNotACallerOnWithdrawal: 8009, "8009": "ShortTokenContractNotACallerOnWithdrawal",
    TotalDepositNotSet: 8005, "8005": "TotalDepositNotSet",
    Unauthorized: 8401, "8401": "Unauthorized",
    /**
     * Contract needs to be unpaused first.
     */
    UnpausedRequired: 21001, "21001": "UnpausedRequired",
});
/**
 * @enum {20002 | 20001 | 60003 | 60002 | 60001 | 20003 | 20000 | 20004}
 */
export const PositionTokenErrors = Object.freeze({
    /**
     * The caller is not the new owner.
     */
    CallerNotTheNewOwner: 20002, "20002": "CallerNotTheNewOwner",
    /**
     * The caller is not the owner.
     */
    CallerNotTheOwner: 20001, "20001": "CallerNotTheOwner",
    /**
     * The user cannot target themselves.
     */
    CannotTargetSelfUser: 60003, "60003": "CannotTargetSelfUser",
    /**
     * Spender does not have enough allowance approved.
     */
    InsufficientAllowance: 60002, "60002": "InsufficientAllowance",
    /**
     * Spender does not have enough balance.
     */
    InsufficientBalance: 60001, "60001": "InsufficientBalance",
    /**
     * The role is missing.
     */
    MissingRole: 20003, "20003": "MissingRole",
    /**
     * The owner is not set.
     */
    OwnerNotSet: 20000, "20000": "OwnerNotSet",
    /**
     * The role cannot be renounced for another address.
     */
    RoleRenounceForAnotherAddress: 20004, "20004": "RoleRenounceForAnotherAddress",
});
/**
 * @enum {0 | 1 | 2 | 3 | 4 | 5 | 6}
 */
export const TransactionStatus = Object.freeze({
    /**
     * The transaction has been signed and successfully deployed to a Casper node.
     */
    SENT: 0, "0": "SENT",
    /**
     * The transaction has been processed by the network. May result in success or failure.
     */
    PROCESSED: 1, "1": "PROCESSED",
    /**
     * The transaction’s time-to-live (TTL) elapsed before execution.
     */
    EXPIRED: 2, "2": "EXPIRED",
    /**
     * The user rejected the signature request.
     */
    CANCELLED: 3, "3": "CANCELLED",
    /**
     * The SDK stopped listening for updates before the transaction was finalized. A custom timeout can be specified (default: 120 seconds).
     */
    TIMEOUT: 4, "4": "TIMEOUT",
    /**
     * An unexpected error occurred while submitting or monitoring the transaction.
     */
    ERROR: 5, "5": "ERROR",
    /**
     * A heartbeat event sent periodically to indicate that the connection is still active.
     */
    PING: 6, "6": "PING",
});
/**
 * @enum {0 | 1 | 2}
 */
export const Verbosity = Object.freeze({
    Low: 0, "0": "Low",
    Medium: 1, "1": "Medium",
    High: 2, "2": "High",
});

const __wbindgen_enum_RequestCache = ["default", "no-store", "reload", "no-cache", "force-cache", "only-if-cached"];

const __wbindgen_enum_RequestCredentials = ["omit", "same-origin", "include"];

const __wbindgen_enum_RequestMode = ["same-origin", "no-cors", "cors", "navigate"];

const AccountInfoFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_accountinfo_free(ptr >>> 0, 1));

export class AccountInfo {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(AccountInfo.prototype);
        obj.__wbg_ptr = ptr;
        AccountInfoFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        AccountInfoFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_accountinfo_free(ptr, 0);
    }
    /**
     * @returns {string}
     */
    get provider() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_accountinfo_provider(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_4(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string[] | undefined}
     */
    get providerSupports() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_accountinfo_providerSupports(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            let v1;
            if (r0 !== 0) {
                v1 = getArrayJsValueFromWasm0(r0, r1).slice();
                wasm.__wbindgen_export_4(r0, r1 * 4, 4);
            }
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {string | undefined}
     */
    get csprName() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_accountinfo_csprName(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            let v1;
            if (r0 !== 0) {
                v1 = getStringFromWasm0(r0, r1).slice();
                wasm.__wbindgen_export_4(r0, r1 * 1, 1);
            }
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {string}
     */
    get publicKey() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_accountinfo_publicKey(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_4(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {bigint}
     */
    get connectedAt() {
        const ret = wasm.__wbg_get_accountinfo_connectedAt(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {string | undefined}
     */
    get token() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_accountinfo_token(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            let v1;
            if (r0 !== 0) {
                v1 = getStringFromWasm0(r0, r1).slice();
                wasm.__wbindgen_export_4(r0, r1 * 1, 1);
            }
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {string | undefined}
     */
    get liquidBalance() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_accountinfo_liquidBalance(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            let v1;
            if (r0 !== 0) {
                v1 = getStringFromWasm0(r0, r1).slice();
                wasm.__wbindgen_export_4(r0, r1 * 1, 1);
            }
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {string | undefined}
     */
    get logo() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_accountinfo_logo(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            let v1;
            if (r0 !== 0) {
                v1 = getStringFromWasm0(r0, r1).slice();
                wasm.__wbindgen_export_4(r0, r1 * 1, 1);
            }
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {Address}
     */
    get address() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.accountinfo_address(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return Address.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {U512}
     */
    get balance() {
        const ret = wasm.accountinfo_balance(this.__wbg_ptr);
        return U512.__wrap(ret);
    }
}

const AddressFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_address_free(ptr >>> 0, 1));

export class Address {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Address.prototype);
        obj.__wbg_ptr = ptr;
        AddressFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        AddressFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_address_free(ptr, 0);
    }
    /**
     * @param {string} address
     */
    constructor(address) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(address, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
            const len0 = WASM_VECTOR_LEN;
            wasm.address_new(retptr, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            this.__wbg_ptr = r0 >>> 0;
            AddressFinalization.register(this, this.__wbg_ptr, this);
            return this;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {HTMLInputElement} input
     * @returns {Address}
     */
    static fromHtmlInput(input) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.address_fromHtmlInput(retptr, addHeapObject(input));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return Address.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {string} input
     * @returns {Address}
     */
    static fromPublicKey(input) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(input, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
            const len0 = WASM_VECTOR_LEN;
            wasm.address_fromPublicKey(retptr, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return Address.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}

const AddressMarketStateFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_addressmarketstate_free(ptr >>> 0, 1));

export class AddressMarketState {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(AddressMarketState.prototype);
        obj.__wbg_ptr = ptr;
        AddressMarketStateFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        AddressMarketStateFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_addressmarketstate_free(ptr, 0);
    }
    /**
     * @returns {MarketState}
     */
    get marketState() {
        const ret = wasm.__wbg_get_addressmarketstate_marketState(this.__wbg_ptr);
        return MarketState.__wrap(ret);
    }
    /**
     * @param {MarketState} arg0
     */
    set marketState(arg0) {
        _assertClass(arg0, MarketState);
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_addressmarketstate_marketState(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {boolean}
     */
    get isPaused() {
        const ret = wasm.__wbg_get_addressmarketstate_isPaused(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {boolean} arg0
     */
    set isPaused(arg0) {
        wasm.__wbg_set_addressmarketstate_isPaused(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {Config}
     */
    get config() {
        const ret = wasm.__wbg_get_addressmarketstate_config(this.__wbg_ptr);
        return Config.__wrap(ret);
    }
    /**
     * @param {Config} arg0
     */
    set config(arg0) {
        _assertClass(arg0, Config);
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_addressmarketstate_config(this.__wbg_ptr, ptr0);
    }
    /**
     * @param {MarketState} marketState
     * @param {boolean} isPaused
     * @param {U256} fee
     * @param {U256} wcsprBalance
     * @param {U256} longTokenBalance
     * @param {U256} shortTokenBalance
     * @param {U256} marketAllowance
     * @param {U256} longPositionValue
     * @param {U256} shortPositionValue
     * @param {U256} totalPositionValue
     * @param {U256} longSharePercentage
     * @param {U256} shortSharePercentage
     * @param {Config} config
     */
    constructor(marketState, isPaused, fee, wcsprBalance, longTokenBalance, shortTokenBalance, marketAllowance, longPositionValue, shortPositionValue, totalPositionValue, longSharePercentage, shortSharePercentage, config) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(marketState, MarketState);
            var ptr0 = marketState.__destroy_into_raw();
            _assertClass(fee, U256);
            var ptr1 = fee.__destroy_into_raw();
            _assertClass(wcsprBalance, U256);
            var ptr2 = wcsprBalance.__destroy_into_raw();
            _assertClass(longTokenBalance, U256);
            var ptr3 = longTokenBalance.__destroy_into_raw();
            _assertClass(shortTokenBalance, U256);
            var ptr4 = shortTokenBalance.__destroy_into_raw();
            _assertClass(marketAllowance, U256);
            var ptr5 = marketAllowance.__destroy_into_raw();
            _assertClass(longPositionValue, U256);
            var ptr6 = longPositionValue.__destroy_into_raw();
            _assertClass(shortPositionValue, U256);
            var ptr7 = shortPositionValue.__destroy_into_raw();
            _assertClass(totalPositionValue, U256);
            var ptr8 = totalPositionValue.__destroy_into_raw();
            _assertClass(longSharePercentage, U256);
            var ptr9 = longSharePercentage.__destroy_into_raw();
            _assertClass(shortSharePercentage, U256);
            var ptr10 = shortSharePercentage.__destroy_into_raw();
            _assertClass(config, Config);
            var ptr11 = config.__destroy_into_raw();
            wasm.addressmarketstate_new(retptr, ptr0, isPaused, ptr1, ptr2, ptr3, ptr4, ptr5, ptr6, ptr7, ptr8, ptr9, ptr10, ptr11);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            this.__wbg_ptr = r0 >>> 0;
            AddressMarketStateFinalization.register(this, this.__wbg_ptr, this);
            return this;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {any}
     */
    toJson() {
        const ret = wasm.addressmarketstate_toJson(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @param {U256} value
     */
    set fee(value) {
        _assertClass(value, U256);
        var ptr0 = value.__destroy_into_raw();
        wasm.addressmarketstate_set_fee(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {U256}
     */
    get fee() {
        const ret = wasm.addressmarketstate_fee(this.__wbg_ptr);
        return U256.__wrap(ret);
    }
    /**
     * @param {U256} value
     */
    set wcspr_balance(value) {
        _assertClass(value, U256);
        var ptr0 = value.__destroy_into_raw();
        wasm.addressmarketstate_set_wcspr_balance(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {U256}
     */
    get wcspr_balance() {
        const ret = wasm.addressmarketstate_wcspr_balance(this.__wbg_ptr);
        return U256.__wrap(ret);
    }
    /**
     * @param {U256} value
     */
    set long_token_balance(value) {
        _assertClass(value, U256);
        var ptr0 = value.__destroy_into_raw();
        wasm.addressmarketstate_set_long_token_balance(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {U256}
     */
    get long_token_balance() {
        const ret = wasm.addressmarketstate_long_token_balance(this.__wbg_ptr);
        return U256.__wrap(ret);
    }
    /**
     * @param {U256} value
     */
    set short_token_balance(value) {
        _assertClass(value, U256);
        var ptr0 = value.__destroy_into_raw();
        wasm.addressmarketstate_set_short_token_balance(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {U256}
     */
    get short_token_balance() {
        const ret = wasm.addressmarketstate_short_token_balance(this.__wbg_ptr);
        return U256.__wrap(ret);
    }
    /**
     * @param {U256} value
     */
    set market_allowance(value) {
        _assertClass(value, U256);
        var ptr0 = value.__destroy_into_raw();
        wasm.addressmarketstate_set_market_allowance(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {U256}
     */
    get market_allowance() {
        const ret = wasm.addressmarketstate_market_allowance(this.__wbg_ptr);
        return U256.__wrap(ret);
    }
    /**
     * @param {U256} value
     */
    set long_position_value(value) {
        _assertClass(value, U256);
        var ptr0 = value.__destroy_into_raw();
        wasm.addressmarketstate_set_long_position_value(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {U256}
     */
    get long_position_value() {
        const ret = wasm.addressmarketstate_long_position_value(this.__wbg_ptr);
        return U256.__wrap(ret);
    }
    /**
     * @param {U256} value
     */
    set short_position_value(value) {
        _assertClass(value, U256);
        var ptr0 = value.__destroy_into_raw();
        wasm.addressmarketstate_set_short_position_value(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {U256}
     */
    get short_position_value() {
        const ret = wasm.addressmarketstate_short_position_value(this.__wbg_ptr);
        return U256.__wrap(ret);
    }
    /**
     * @param {U256} value
     */
    set total_position_value(value) {
        _assertClass(value, U256);
        var ptr0 = value.__destroy_into_raw();
        wasm.addressmarketstate_set_total_position_value(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {U256}
     */
    get total_position_value() {
        const ret = wasm.addressmarketstate_total_position_value(this.__wbg_ptr);
        return U256.__wrap(ret);
    }
    /**
     * @param {U256} value
     */
    set long_share_percentage(value) {
        _assertClass(value, U256);
        var ptr0 = value.__destroy_into_raw();
        wasm.addressmarketstate_set_long_share_percentage(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {U256}
     */
    get long_share_percentage() {
        const ret = wasm.addressmarketstate_long_share_percentage(this.__wbg_ptr);
        return U256.__wrap(ret);
    }
    /**
     * @param {U256} value
     */
    set short_share_percentage(value) {
        _assertClass(value, U256);
        var ptr0 = value.__destroy_into_raw();
        wasm.addressmarketstate_set_short_share_percentage(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {U256}
     */
    get short_share_percentage() {
        const ret = wasm.addressmarketstate_short_share_percentage(this.__wbg_ptr);
        return U256.__wrap(ret);
    }
}

const ArgValueFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_argvalue_free(ptr >>> 0, 1));

export class ArgValue {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ArgValueFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_argvalue_free(ptr, 0);
    }
}

const BalanceFormatterFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_balanceformatter_free(ptr >>> 0, 1));

export class BalanceFormatter {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(BalanceFormatter.prototype);
        obj.__wbg_ptr = ptr;
        BalanceFormatterFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        BalanceFormatterFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_balanceformatter_free(ptr, 0);
    }
    /**
     * @returns {string}
     */
    fmt() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.balanceformatter_fmt(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_4(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {number} precision
     * @returns {string}
     */
    fmtWithPrecision(precision) {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.balanceformatter_fmtWithPrecision(retptr, this.__wbg_ptr, precision);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_4(deferred1_0, deferred1_1, 1);
        }
    }
}

const BurnFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_burn_free(ptr >>> 0, 1));

export class Burn {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        BurnFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_burn_free(ptr, 0);
    }
    /**
     * @param {Address} owner
     * @param {U256} amount
     */
    constructor(owner, amount) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(owner, Address);
            var ptr0 = owner.__destroy_into_raw();
            _assertClass(amount, U256);
            var ptr1 = amount.__destroy_into_raw();
            wasm.burn_new(retptr, ptr0, ptr1);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            this.__wbg_ptr = r0 >>> 0;
            BurnFinalization.register(this, this.__wbg_ptr, this);
            return this;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {any}
     */
    toJson() {
        const ret = wasm.burn_toJson(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @param {Address} value
     */
    set owner(value) {
        _assertClass(value, Address);
        var ptr0 = value.__destroy_into_raw();
        wasm.burn_set_owner(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {Address}
     */
    get owner() {
        const ret = wasm.burn_owner(this.__wbg_ptr);
        return Address.__wrap(ret);
    }
    /**
     * @param {U256} value
     */
    set amount(value) {
        _assertClass(value, U256);
        var ptr0 = value.__destroy_into_raw();
        wasm.burn_set_amount(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {U256}
     */
    get amount() {
        const ret = wasm.burn_amount(this.__wbg_ptr);
        return U256.__wrap(ret);
    }
}

const BytesFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_bytes_free(ptr >>> 0, 1));

export class Bytes {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Bytes.prototype);
        obj.__wbg_ptr = ptr;
        BytesFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        BytesFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_bytes_free(ptr, 0);
    }
    constructor() {
        const ret = wasm.bytes_new();
        this.__wbg_ptr = ret >>> 0;
        BytesFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {Uint8Array} uint8_array
     * @returns {Bytes}
     */
    static fromUint8Array(uint8_array) {
        const ret = wasm.bytes_fromUint8Array(addHeapObject(uint8_array));
        return Bytes.__wrap(ret);
    }
    /**
     * @returns {string}
     */
    toString() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.bytes_toString(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_4(deferred1_0, deferred1_1, 1);
        }
    }
}

const CasperWalletFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_casperwallet_free(ptr >>> 0, 1));

export class CasperWallet {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        CasperWalletFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_casperwallet_free(ptr, 0);
    }
}

const ConfigFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_config_free(ptr >>> 0, 1));

export class Config {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Config.prototype);
        obj.__wbg_ptr = ptr;
        ConfigFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ConfigFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_config_free(ptr, 0);
    }
    /**
     * @param {Address} longToken
     * @param {Address} shortToken
     * @param {Address} wcsprToken
     * @param {Address} feeCollector
     */
    constructor(longToken, shortToken, wcsprToken, feeCollector) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(longToken, Address);
            var ptr0 = longToken.__destroy_into_raw();
            _assertClass(shortToken, Address);
            var ptr1 = shortToken.__destroy_into_raw();
            _assertClass(wcsprToken, Address);
            var ptr2 = wcsprToken.__destroy_into_raw();
            _assertClass(feeCollector, Address);
            var ptr3 = feeCollector.__destroy_into_raw();
            wasm.config_new(retptr, ptr0, ptr1, ptr2, ptr3);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            this.__wbg_ptr = r0 >>> 0;
            ConfigFinalization.register(this, this.__wbg_ptr, this);
            return this;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {any}
     */
    toJson() {
        const ret = wasm.config_toJson(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @param {Address} value
     */
    set long_token(value) {
        _assertClass(value, Address);
        var ptr0 = value.__destroy_into_raw();
        wasm.config_set_long_token(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {Address}
     */
    get long_token() {
        const ret = wasm.config_long_token(this.__wbg_ptr);
        return Address.__wrap(ret);
    }
    /**
     * @param {Address} value
     */
    set short_token(value) {
        _assertClass(value, Address);
        var ptr0 = value.__destroy_into_raw();
        wasm.config_set_short_token(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {Address}
     */
    get short_token() {
        const ret = wasm.config_short_token(this.__wbg_ptr);
        return Address.__wrap(ret);
    }
    /**
     * @param {Address} value
     */
    set wcspr_token(value) {
        _assertClass(value, Address);
        var ptr0 = value.__destroy_into_raw();
        wasm.config_set_wcspr_token(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {Address}
     */
    get wcspr_token() {
        const ret = wasm.config_wcspr_token(this.__wbg_ptr);
        return Address.__wrap(ret);
    }
    /**
     * @param {Address} value
     */
    set fee_collector(value) {
        _assertClass(value, Address);
        var ptr0 = value.__destroy_into_raw();
        wasm.config_set_fee_collector(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {Address}
     */
    get fee_collector() {
        const ret = wasm.config_fee_collector(this.__wbg_ptr);
        return Address.__wrap(ret);
    }
}

const ConfigUpdatedFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_configupdated_free(ptr >>> 0, 1));

export class ConfigUpdated {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ConfigUpdatedFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_configupdated_free(ptr, 0);
    }
    /**
     * @param {Address} admin
     * @param {Address} longToken
     * @param {Address} shortToken
     * @param {Address} wcsprToken
     * @param {Address} feeCollector
     */
    constructor(admin, longToken, shortToken, wcsprToken, feeCollector) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(admin, Address);
            var ptr0 = admin.__destroy_into_raw();
            _assertClass(longToken, Address);
            var ptr1 = longToken.__destroy_into_raw();
            _assertClass(shortToken, Address);
            var ptr2 = shortToken.__destroy_into_raw();
            _assertClass(wcsprToken, Address);
            var ptr3 = wcsprToken.__destroy_into_raw();
            _assertClass(feeCollector, Address);
            var ptr4 = feeCollector.__destroy_into_raw();
            wasm.configupdated_new(retptr, ptr0, ptr1, ptr2, ptr3, ptr4);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            this.__wbg_ptr = r0 >>> 0;
            ConfigUpdatedFinalization.register(this, this.__wbg_ptr, this);
            return this;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {any}
     */
    toJson() {
        const ret = wasm.configupdated_toJson(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @param {Address} value
     */
    set admin(value) {
        _assertClass(value, Address);
        var ptr0 = value.__destroy_into_raw();
        wasm.configupdated_set_admin(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {Address}
     */
    get admin() {
        const ret = wasm.configupdated_admin(this.__wbg_ptr);
        return Address.__wrap(ret);
    }
    /**
     * @param {Address} value
     */
    set long_token(value) {
        _assertClass(value, Address);
        var ptr0 = value.__destroy_into_raw();
        wasm.configupdated_set_long_token(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {Address}
     */
    get long_token() {
        const ret = wasm.configupdated_long_token(this.__wbg_ptr);
        return Address.__wrap(ret);
    }
    /**
     * @param {Address} value
     */
    set short_token(value) {
        _assertClass(value, Address);
        var ptr0 = value.__destroy_into_raw();
        wasm.configupdated_set_short_token(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {Address}
     */
    get short_token() {
        const ret = wasm.configupdated_short_token(this.__wbg_ptr);
        return Address.__wrap(ret);
    }
    /**
     * @param {Address} value
     */
    set wcspr_token(value) {
        _assertClass(value, Address);
        var ptr0 = value.__destroy_into_raw();
        wasm.configupdated_set_wcspr_token(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {Address}
     */
    get wcspr_token() {
        const ret = wasm.configupdated_wcspr_token(this.__wbg_ptr);
        return Address.__wrap(ret);
    }
    /**
     * @param {Address} value
     */
    set fee_collector(value) {
        _assertClass(value, Address);
        var ptr0 = value.__destroy_into_raw();
        wasm.configupdated_set_fee_collector(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {Address}
     */
    get fee_collector() {
        const ret = wasm.configupdated_fee_collector(this.__wbg_ptr);
        return Address.__wrap(ret);
    }
}

const ContractInfoFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_contractinfo_free(ptr >>> 0, 1));

export class ContractInfo {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ContractInfo.prototype);
        obj.__wbg_ptr = ptr;
        ContractInfoFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ContractInfoFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_contractinfo_free(ptr, 0);
    }
    /**
     * @returns {string}
     */
    get name() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_contractinfo_name(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_4(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {string} arg0
     */
    set name(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_contractinfo_name(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {string}
     */
    get package_hash() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_contractinfo_package_hash(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_4(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {string} arg0
     */
    set package_hash(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_contractinfo_package_hash(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {Address}
     */
    get address() {
        const ret = wasm.contractinfo_address(this.__wbg_ptr);
        return Address.__wrap(ret);
    }
}

const ContractsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_contracts_free(ptr >>> 0, 1));

export class Contracts {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ContractsFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_contracts_free(ptr, 0);
    }
    /**
     * @param {any} js
     */
    constructor(js) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.contracts_new(retptr, addHeapObject(js));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            this.__wbg_ptr = r0 >>> 0;
            ContractsFinalization.register(this, this.__wbg_ptr, this);
            return this;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {string} name
     * @returns {ContractInfo}
     */
    get(name) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(name, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
            const len0 = WASM_VECTOR_LEN;
            wasm.contracts_get(retptr, this.__wbg_ptr, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return ContractInfo.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}

const CsprClickCallbacksFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_csprclickcallbacks_free(ptr >>> 0, 1));

export class CsprClickCallbacks {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        CsprClickCallbacksFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_csprclickcallbacks_free(ptr, 0);
    }
    /**
     * @param {Function} callback
     */
    static onSignedIn(callback) {
        wasm.csprclickcallbacks_onSignedIn(addHeapObject(callback));
    }
    /**
     * @param {Function} callback
     */
    static onSwitchedAccount(callback) {
        wasm.csprclickcallbacks_onSwitchedAccount(addHeapObject(callback));
    }
    /**
     * @param {Function} callback
     */
    static onUnsolicitedAccountChange(callback) {
        wasm.csprclickcallbacks_onUnsolicitedAccountChange(addHeapObject(callback));
    }
    /**
     * @param {Function} callback
     */
    static onSignedOut(callback) {
        wasm.csprclickcallbacks_onSignedOut(addHeapObject(callback));
    }
    /**
     * @param {Function} callback
     */
    static onDisconnected(callback) {
        wasm.csprclickcallbacks_onDisconnected(addHeapObject(callback));
    }
    /**
     * @param {Function} callback
     */
    static onTransactionStatusUpdate(callback) {
        wasm.csprclickcallbacks_onTransactionStatusUpdate(addHeapObject(callback));
    }
}

const DecreaseAllowanceFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_decreaseallowance_free(ptr >>> 0, 1));

export class DecreaseAllowance {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        DecreaseAllowanceFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_decreaseallowance_free(ptr, 0);
    }
    /**
     * @param {Address} owner
     * @param {Address} spender
     * @param {U256} allowance
     * @param {U256} decrBy
     */
    constructor(owner, spender, allowance, decrBy) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(owner, Address);
            var ptr0 = owner.__destroy_into_raw();
            _assertClass(spender, Address);
            var ptr1 = spender.__destroy_into_raw();
            _assertClass(allowance, U256);
            var ptr2 = allowance.__destroy_into_raw();
            _assertClass(decrBy, U256);
            var ptr3 = decrBy.__destroy_into_raw();
            wasm.decreaseallowance_new(retptr, ptr0, ptr1, ptr2, ptr3);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            this.__wbg_ptr = r0 >>> 0;
            DecreaseAllowanceFinalization.register(this, this.__wbg_ptr, this);
            return this;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {any}
     */
    toJson() {
        const ret = wasm.decreaseallowance_toJson(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @param {Address} value
     */
    set owner(value) {
        _assertClass(value, Address);
        var ptr0 = value.__destroy_into_raw();
        wasm.decreaseallowance_set_owner(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {Address}
     */
    get owner() {
        const ret = wasm.decreaseallowance_owner(this.__wbg_ptr);
        return Address.__wrap(ret);
    }
    /**
     * @param {Address} value
     */
    set spender(value) {
        _assertClass(value, Address);
        var ptr0 = value.__destroy_into_raw();
        wasm.decreaseallowance_set_spender(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {Address}
     */
    get spender() {
        const ret = wasm.decreaseallowance_spender(this.__wbg_ptr);
        return Address.__wrap(ret);
    }
    /**
     * @param {U256} value
     */
    set allowance(value) {
        _assertClass(value, U256);
        var ptr0 = value.__destroy_into_raw();
        wasm.decreaseallowance_set_allowance(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {U256}
     */
    get allowance() {
        const ret = wasm.decreaseallowance_allowance(this.__wbg_ptr);
        return U256.__wrap(ret);
    }
    /**
     * @param {U256} value
     */
    set decr_by(value) {
        _assertClass(value, U256);
        var ptr0 = value.__destroy_into_raw();
        wasm.decreaseallowance_set_decr_by(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {U256}
     */
    get decr_by() {
        const ret = wasm.decreaseallowance_decr_by(this.__wbg_ptr);
        return U256.__wrap(ret);
    }
}

const FaucetableWcsprWasmClientFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_faucetablewcsprwasmclient_free(ptr >>> 0, 1));

export class FaucetableWcsprWasmClient {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        FaucetableWcsprWasmClientFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_faucetablewcsprwasmclient_free(ptr, 0);
    }
    /**
     * @param {OdraWasmClient} wasmClient
     * @param {Address} address
     */
    constructor(wasmClient, address) {
        _assertClass(wasmClient, OdraWasmClient);
        _assertClass(address, Address);
        var ptr0 = address.__destroy_into_raw();
        const ret = wasm.faucetablewcsprwasmclient_new(wasmClient.__wbg_ptr, ptr0);
        this.__wbg_ptr = ret >>> 0;
        FaucetableWcsprWasmClientFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {Address} recipient
     * @param {U256} amount
     * @returns {Promise<TransactionResult>}
     */
    transfer(recipient, amount) {
        _assertClass(recipient, Address);
        var ptr0 = recipient.__destroy_into_raw();
        _assertClass(amount, U256);
        var ptr1 = amount.__destroy_into_raw();
        const ret = wasm.faucetablewcsprwasmclient_transfer(this.__wbg_ptr, ptr0, ptr1);
        return takeObject(ret);
    }
    /**
     * @param {Address} owner
     * @param {Address} recipient
     * @param {U256} amount
     * @returns {Promise<TransactionResult>}
     */
    transferFrom(owner, recipient, amount) {
        _assertClass(owner, Address);
        var ptr0 = owner.__destroy_into_raw();
        _assertClass(recipient, Address);
        var ptr1 = recipient.__destroy_into_raw();
        _assertClass(amount, U256);
        var ptr2 = amount.__destroy_into_raw();
        const ret = wasm.faucetablewcsprwasmclient_transferFrom(this.__wbg_ptr, ptr0, ptr1, ptr2);
        return takeObject(ret);
    }
    /**
     * @returns {Promise<TransactionResult>}
     */
    faucet() {
        const ret = wasm.faucetablewcsprwasmclient_faucet(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @returns {Promise<Address[]>}
     */
    participants() {
        const ret = wasm.faucetablewcsprwasmclient_participants(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * Add a new transfer manager (admin only)
     * @param {Address} address
     * @returns {Promise<TransactionResult>}
     */
    addTransferManager(address) {
        _assertClass(address, Address);
        var ptr0 = address.__destroy_into_raw();
        const ret = wasm.faucetablewcsprwasmclient_addTransferManager(this.__wbg_ptr, ptr0);
        return takeObject(ret);
    }
    /**
     * Remove a transfer manager (admin only)
     * @param {Address} address
     * @returns {Promise<TransactionResult>}
     */
    removeTransferManager(address) {
        _assertClass(address, Address);
        var ptr0 = address.__destroy_into_raw();
        const ret = wasm.faucetablewcsprwasmclient_removeTransferManager(this.__wbg_ptr, ptr0);
        return takeObject(ret);
    }
    /**
     * Delegated. See `self.access_control.has_role()` for details.
     * @param {Uint8Array} role
     * @param {Address} address
     * @returns {Promise<boolean>}
     */
    hasRole(role, address) {
        const ptr0 = passArray8ToWasm0(role, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        _assertClass(address, Address);
        var ptr1 = address.__destroy_into_raw();
        const ret = wasm.faucetablewcsprwasmclient_hasRole(this.__wbg_ptr, ptr0, len0, ptr1);
        return takeObject(ret);
    }
    /**
     * Delegated. See `self.access_control.grant_role()` for details.
     * @param {Uint8Array} role
     * @param {Address} address
     * @returns {Promise<TransactionResult>}
     */
    grantRole(role, address) {
        const ptr0 = passArray8ToWasm0(role, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        _assertClass(address, Address);
        var ptr1 = address.__destroy_into_raw();
        const ret = wasm.faucetablewcsprwasmclient_grantRole(this.__wbg_ptr, ptr0, len0, ptr1);
        return takeObject(ret);
    }
    /**
     * Delegated. See `self.access_control.revoke_role()` for details.
     * @param {Uint8Array} role
     * @param {Address} address
     * @returns {Promise<TransactionResult>}
     */
    revokeRole(role, address) {
        const ptr0 = passArray8ToWasm0(role, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        _assertClass(address, Address);
        var ptr1 = address.__destroy_into_raw();
        const ret = wasm.faucetablewcsprwasmclient_revokeRole(this.__wbg_ptr, ptr0, len0, ptr1);
        return takeObject(ret);
    }
    /**
     * Delegated. See `self.access_control.get_role_admin()` for details.
     * @param {Uint8Array} role
     * @returns {Promise<Uint8Array>}
     */
    getRoleAdmin(role) {
        const ptr0 = passArray8ToWasm0(role, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.faucetablewcsprwasmclient_getRoleAdmin(this.__wbg_ptr, ptr0, len0);
        return takeObject(ret);
    }
    /**
     * Delegated. See `self.access_control.renounce_role()` for details.
     * @param {Uint8Array} role
     * @param {Address} address
     * @returns {Promise<TransactionResult>}
     */
    renounceRole(role, address) {
        const ptr0 = passArray8ToWasm0(role, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        _assertClass(address, Address);
        var ptr1 = address.__destroy_into_raw();
        const ret = wasm.faucetablewcsprwasmclient_renounceRole(this.__wbg_ptr, ptr0, len0, ptr1);
        return takeObject(ret);
    }
    /**
     * Delegated. See `self.wcspr.name()` for details.
     * @returns {Promise<string>}
     */
    name() {
        const ret = wasm.faucetablewcsprwasmclient_name(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * Delegated. See `self.wcspr.symbol()` for details.
     * @returns {Promise<string>}
     */
    symbol() {
        const ret = wasm.faucetablewcsprwasmclient_symbol(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * Delegated. See `self.wcspr.decimals()` for details.
     * @returns {Promise<number>}
     */
    decimals() {
        const ret = wasm.faucetablewcsprwasmclient_decimals(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * Delegated. See `self.wcspr.total_supply()` for details.
     * @returns {Promise<U256>}
     */
    totalSupply() {
        const ret = wasm.faucetablewcsprwasmclient_totalSupply(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * Delegated. See `self.wcspr.balance_of()` for details.
     * @param {Address} address
     * @returns {Promise<U256>}
     */
    balanceOf(address) {
        _assertClass(address, Address);
        var ptr0 = address.__destroy_into_raw();
        const ret = wasm.faucetablewcsprwasmclient_balanceOf(this.__wbg_ptr, ptr0);
        return takeObject(ret);
    }
    /**
     * Delegated. See `self.wcspr.allowance()` for details.
     * @param {Address} owner
     * @param {Address} spender
     * @returns {Promise<U256>}
     */
    allowance(owner, spender) {
        _assertClass(owner, Address);
        var ptr0 = owner.__destroy_into_raw();
        _assertClass(spender, Address);
        var ptr1 = spender.__destroy_into_raw();
        const ret = wasm.faucetablewcsprwasmclient_allowance(this.__wbg_ptr, ptr0, ptr1);
        return takeObject(ret);
    }
    /**
     * Delegated. See `self.wcspr.approve()` for details.
     * @param {Address} spender
     * @param {U256} amount
     * @returns {Promise<TransactionResult>}
     */
    approve(spender, amount) {
        _assertClass(spender, Address);
        var ptr0 = spender.__destroy_into_raw();
        _assertClass(amount, U256);
        var ptr1 = amount.__destroy_into_raw();
        const ret = wasm.faucetablewcsprwasmclient_approve(this.__wbg_ptr, ptr0, ptr1);
        return takeObject(ret);
    }
}

const FeeCollectedFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_feecollected_free(ptr >>> 0, 1));

export class FeeCollected {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        FeeCollectedFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_feecollected_free(ptr, 0);
    }
    /**
     * @param {U256} amount
     * @param {Address} feeCollector
     */
    constructor(amount, feeCollector) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(amount, U256);
            var ptr0 = amount.__destroy_into_raw();
            _assertClass(feeCollector, Address);
            var ptr1 = feeCollector.__destroy_into_raw();
            wasm.feecollected_new(retptr, ptr0, ptr1);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            this.__wbg_ptr = r0 >>> 0;
            FeeCollectedFinalization.register(this, this.__wbg_ptr, this);
            return this;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {any}
     */
    toJson() {
        const ret = wasm.feecollected_toJson(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @param {U256} value
     */
    set amount(value) {
        _assertClass(value, U256);
        var ptr0 = value.__destroy_into_raw();
        wasm.feecollected_set_amount(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {U256}
     */
    get amount() {
        const ret = wasm.burn_amount(this.__wbg_ptr);
        return U256.__wrap(ret);
    }
    /**
     * @param {Address} value
     */
    set fee_collector(value) {
        _assertClass(value, Address);
        var ptr0 = value.__destroy_into_raw();
        wasm.feecollected_set_fee_collector(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {Address}
     */
    get fee_collector() {
        const ret = wasm.burn_owner(this.__wbg_ptr);
        return Address.__wrap(ret);
    }
}

const IncreaseAllowanceFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_increaseallowance_free(ptr >>> 0, 1));

export class IncreaseAllowance {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        IncreaseAllowanceFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_increaseallowance_free(ptr, 0);
    }
    /**
     * @param {Address} owner
     * @param {Address} spender
     * @param {U256} allowance
     * @param {U256} incBy
     */
    constructor(owner, spender, allowance, incBy) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(owner, Address);
            var ptr0 = owner.__destroy_into_raw();
            _assertClass(spender, Address);
            var ptr1 = spender.__destroy_into_raw();
            _assertClass(allowance, U256);
            var ptr2 = allowance.__destroy_into_raw();
            _assertClass(incBy, U256);
            var ptr3 = incBy.__destroy_into_raw();
            wasm.decreaseallowance_new(retptr, ptr0, ptr1, ptr2, ptr3);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            this.__wbg_ptr = r0 >>> 0;
            IncreaseAllowanceFinalization.register(this, this.__wbg_ptr, this);
            return this;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {any}
     */
    toJson() {
        const ret = wasm.increaseallowance_toJson(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @param {Address} value
     */
    set owner(value) {
        _assertClass(value, Address);
        var ptr0 = value.__destroy_into_raw();
        wasm.increaseallowance_set_owner(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {Address}
     */
    get owner() {
        const ret = wasm.decreaseallowance_owner(this.__wbg_ptr);
        return Address.__wrap(ret);
    }
    /**
     * @param {Address} value
     */
    set spender(value) {
        _assertClass(value, Address);
        var ptr0 = value.__destroy_into_raw();
        wasm.increaseallowance_set_spender(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {Address}
     */
    get spender() {
        const ret = wasm.decreaseallowance_spender(this.__wbg_ptr);
        return Address.__wrap(ret);
    }
    /**
     * @param {U256} value
     */
    set allowance(value) {
        _assertClass(value, U256);
        var ptr0 = value.__destroy_into_raw();
        wasm.increaseallowance_set_allowance(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {U256}
     */
    get allowance() {
        const ret = wasm.decreaseallowance_allowance(this.__wbg_ptr);
        return U256.__wrap(ret);
    }
    /**
     * @param {U256} value
     */
    set inc_by(value) {
        _assertClass(value, U256);
        var ptr0 = value.__destroy_into_raw();
        wasm.increaseallowance_set_inc_by(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {U256}
     */
    get inc_by() {
        const ret = wasm.decreaseallowance_decr_by(this.__wbg_ptr);
        return U256.__wrap(ret);
    }
}

const LongDepositedFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_longdeposited_free(ptr >>> 0, 1));

export class LongDeposited {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        LongDepositedFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_longdeposited_free(ptr, 0);
    }
    /**
     * @param {Address} user
     * @param {U256} wcsprAmount
     * @param {U256} longTokensMinted
     * @param {U256} feeCollected
     */
    constructor(user, wcsprAmount, longTokensMinted, feeCollected) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(user, Address);
            var ptr0 = user.__destroy_into_raw();
            _assertClass(wcsprAmount, U256);
            var ptr1 = wcsprAmount.__destroy_into_raw();
            _assertClass(longTokensMinted, U256);
            var ptr2 = longTokensMinted.__destroy_into_raw();
            _assertClass(feeCollected, U256);
            var ptr3 = feeCollected.__destroy_into_raw();
            wasm.longdeposited_new(retptr, ptr0, ptr1, ptr2, ptr3);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            this.__wbg_ptr = r0 >>> 0;
            LongDepositedFinalization.register(this, this.__wbg_ptr, this);
            return this;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {any}
     */
    toJson() {
        const ret = wasm.longdeposited_toJson(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @param {Address} value
     */
    set user(value) {
        _assertClass(value, Address);
        var ptr0 = value.__destroy_into_raw();
        wasm.longdeposited_set_user(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {Address}
     */
    get user() {
        const ret = wasm.longdeposited_user(this.__wbg_ptr);
        return Address.__wrap(ret);
    }
    /**
     * @param {U256} value
     */
    set wcspr_amount(value) {
        _assertClass(value, U256);
        var ptr0 = value.__destroy_into_raw();
        wasm.longdeposited_set_wcspr_amount(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {U256}
     */
    get wcspr_amount() {
        const ret = wasm.decreaseallowance_allowance(this.__wbg_ptr);
        return U256.__wrap(ret);
    }
    /**
     * @param {U256} value
     */
    set long_tokens_minted(value) {
        _assertClass(value, U256);
        var ptr0 = value.__destroy_into_raw();
        wasm.longdeposited_set_long_tokens_minted(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {U256}
     */
    get long_tokens_minted() {
        const ret = wasm.decreaseallowance_decr_by(this.__wbg_ptr);
        return U256.__wrap(ret);
    }
    /**
     * @param {U256} value
     */
    set fee_collected(value) {
        _assertClass(value, U256);
        var ptr0 = value.__destroy_into_raw();
        wasm.longdeposited_set_fee_collected(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {U256}
     */
    get fee_collected() {
        const ret = wasm.longdeposited_fee_collected(this.__wbg_ptr);
        return U256.__wrap(ret);
    }
}

const LongWithdrawnFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_longwithdrawn_free(ptr >>> 0, 1));

export class LongWithdrawn {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        LongWithdrawnFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_longwithdrawn_free(ptr, 0);
    }
    /**
     * @param {Address} user
     * @param {U256} longTokensBurned
     * @param {U256} wcsprAmount
     * @param {U256} feeCollected
     */
    constructor(user, longTokensBurned, wcsprAmount, feeCollected) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(user, Address);
            var ptr0 = user.__destroy_into_raw();
            _assertClass(longTokensBurned, U256);
            var ptr1 = longTokensBurned.__destroy_into_raw();
            _assertClass(wcsprAmount, U256);
            var ptr2 = wcsprAmount.__destroy_into_raw();
            _assertClass(feeCollected, U256);
            var ptr3 = feeCollected.__destroy_into_raw();
            wasm.longdeposited_new(retptr, ptr0, ptr1, ptr2, ptr3);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            this.__wbg_ptr = r0 >>> 0;
            LongWithdrawnFinalization.register(this, this.__wbg_ptr, this);
            return this;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {any}
     */
    toJson() {
        const ret = wasm.longwithdrawn_toJson(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @param {Address} value
     */
    set user(value) {
        _assertClass(value, Address);
        var ptr0 = value.__destroy_into_raw();
        wasm.longwithdrawn_set_user(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {Address}
     */
    get user() {
        const ret = wasm.longdeposited_user(this.__wbg_ptr);
        return Address.__wrap(ret);
    }
    /**
     * @param {U256} value
     */
    set long_tokens_burned(value) {
        _assertClass(value, U256);
        var ptr0 = value.__destroy_into_raw();
        wasm.longwithdrawn_set_long_tokens_burned(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {U256}
     */
    get long_tokens_burned() {
        const ret = wasm.decreaseallowance_allowance(this.__wbg_ptr);
        return U256.__wrap(ret);
    }
    /**
     * @param {U256} value
     */
    set wcspr_amount(value) {
        _assertClass(value, U256);
        var ptr0 = value.__destroy_into_raw();
        wasm.longwithdrawn_set_wcspr_amount(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {U256}
     */
    get wcspr_amount() {
        const ret = wasm.decreaseallowance_decr_by(this.__wbg_ptr);
        return U256.__wrap(ret);
    }
    /**
     * @param {U256} value
     */
    set fee_collected(value) {
        _assertClass(value, U256);
        var ptr0 = value.__destroy_into_raw();
        wasm.longwithdrawn_set_fee_collected(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {U256}
     */
    get fee_collected() {
        const ret = wasm.longdeposited_fee_collected(this.__wbg_ptr);
        return U256.__wrap(ret);
    }
}

const MarketStateFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_marketstate_free(ptr >>> 0, 1));

export class MarketState {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(MarketState.prototype);
        obj.__wbg_ptr = ptr;
        MarketStateFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        MarketStateFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_marketstate_free(ptr, 0);
    }
    /**
     * @param {U256} longTotalSupply
     * @param {U256} shortTotalSupply
     * @param {U256} longLiquidity
     * @param {U256} shortLiquidity
     * @param {U256} price
     */
    constructor(longTotalSupply, shortTotalSupply, longLiquidity, shortLiquidity, price) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(longTotalSupply, U256);
            var ptr0 = longTotalSupply.__destroy_into_raw();
            _assertClass(shortTotalSupply, U256);
            var ptr1 = shortTotalSupply.__destroy_into_raw();
            _assertClass(longLiquidity, U256);
            var ptr2 = longLiquidity.__destroy_into_raw();
            _assertClass(shortLiquidity, U256);
            var ptr3 = shortLiquidity.__destroy_into_raw();
            _assertClass(price, U256);
            var ptr4 = price.__destroy_into_raw();
            wasm.marketstate_new(retptr, ptr0, ptr1, ptr2, ptr3, ptr4);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            this.__wbg_ptr = r0 >>> 0;
            MarketStateFinalization.register(this, this.__wbg_ptr, this);
            return this;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {any}
     */
    toJson() {
        const ret = wasm.marketstate_toJson(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @param {U256} value
     */
    set long_total_supply(value) {
        _assertClass(value, U256);
        var ptr0 = value.__destroy_into_raw();
        wasm.marketstate_set_long_total_supply(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {U256}
     */
    get long_total_supply() {
        const ret = wasm.marketstate_long_total_supply(this.__wbg_ptr);
        return U256.__wrap(ret);
    }
    /**
     * @param {U256} value
     */
    set short_total_supply(value) {
        _assertClass(value, U256);
        var ptr0 = value.__destroy_into_raw();
        wasm.marketstate_set_short_total_supply(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {U256}
     */
    get short_total_supply() {
        const ret = wasm.marketstate_short_total_supply(this.__wbg_ptr);
        return U256.__wrap(ret);
    }
    /**
     * @param {U256} value
     */
    set long_liquidity(value) {
        _assertClass(value, U256);
        var ptr0 = value.__destroy_into_raw();
        wasm.marketstate_set_long_liquidity(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {U256}
     */
    get long_liquidity() {
        const ret = wasm.marketstate_long_liquidity(this.__wbg_ptr);
        return U256.__wrap(ret);
    }
    /**
     * @param {U256} value
     */
    set short_liquidity(value) {
        _assertClass(value, U256);
        var ptr0 = value.__destroy_into_raw();
        wasm.marketstate_set_short_liquidity(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {U256}
     */
    get short_liquidity() {
        const ret = wasm.marketstate_short_liquidity(this.__wbg_ptr);
        return U256.__wrap(ret);
    }
    /**
     * @param {U256} value
     */
    set price(value) {
        _assertClass(value, U256);
        var ptr0 = value.__destroy_into_raw();
        wasm.marketstate_set_price(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {U256}
     */
    get price() {
        const ret = wasm.marketstate_price(this.__wbg_ptr);
        return U256.__wrap(ret);
    }
}

const MarketWasmClientFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_marketwasmclient_free(ptr >>> 0, 1));

export class MarketWasmClient {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        MarketWasmClientFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_marketwasmclient_free(ptr, 0);
    }
    /**
     * @param {OdraWasmClient} wasmClient
     * @param {Address} address
     */
    constructor(wasmClient, address) {
        _assertClass(wasmClient, OdraWasmClient);
        _assertClass(address, Address);
        var ptr0 = address.__destroy_into_raw();
        const ret = wasm.faucetablewcsprwasmclient_new(wasmClient.__wbg_ptr, ptr0);
        this.__wbg_ptr = ret >>> 0;
        MarketWasmClientFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {Promise<TransactionResult>}
     */
    pause() {
        const ret = wasm.marketwasmclient_pause(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @returns {Promise<TransactionResult>}
     */
    unpause() {
        const ret = wasm.marketwasmclient_unpause(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @returns {Promise<boolean>}
     */
    isPaused() {
        const ret = wasm.marketwasmclient_isPaused(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @returns {Promise<TransactionResult>}
     */
    updatePrice() {
        const ret = wasm.marketwasmclient_updatePrice(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @param {U256} wcsprAmount
     * @returns {Promise<TransactionResult>}
     */
    depositLong(wcsprAmount) {
        _assertClass(wcsprAmount, U256);
        var ptr0 = wcsprAmount.__destroy_into_raw();
        const ret = wasm.marketwasmclient_depositLong(this.__wbg_ptr, ptr0);
        return takeObject(ret);
    }
    /**
     * @param {Address} sender
     * @param {U256} wcsprAmount
     * @returns {Promise<TransactionResult>}
     */
    depositLongFrom(sender, wcsprAmount) {
        _assertClass(sender, Address);
        var ptr0 = sender.__destroy_into_raw();
        _assertClass(wcsprAmount, U256);
        var ptr1 = wcsprAmount.__destroy_into_raw();
        const ret = wasm.marketwasmclient_depositLongFrom(this.__wbg_ptr, ptr0, ptr1);
        return takeObject(ret);
    }
    /**
     * @param {U256} wcsprAmount
     * @returns {Promise<TransactionResult>}
     */
    depositShort(wcsprAmount) {
        _assertClass(wcsprAmount, U256);
        var ptr0 = wcsprAmount.__destroy_into_raw();
        const ret = wasm.marketwasmclient_depositShort(this.__wbg_ptr, ptr0);
        return takeObject(ret);
    }
    /**
     * @param {Address} sender
     * @param {U256} wcsprAmount
     * @returns {Promise<TransactionResult>}
     */
    depositShortFrom(sender, wcsprAmount) {
        _assertClass(sender, Address);
        var ptr0 = sender.__destroy_into_raw();
        _assertClass(wcsprAmount, U256);
        var ptr1 = wcsprAmount.__destroy_into_raw();
        const ret = wasm.marketwasmclient_depositShortFrom(this.__wbg_ptr, ptr0, ptr1);
        return takeObject(ret);
    }
    /**
     * @param {U256} longTokenAmount
     * @returns {Promise<TransactionResult>}
     */
    withdrawLong(longTokenAmount) {
        _assertClass(longTokenAmount, U256);
        var ptr0 = longTokenAmount.__destroy_into_raw();
        const ret = wasm.marketwasmclient_withdrawLong(this.__wbg_ptr, ptr0);
        return takeObject(ret);
    }
    /**
     * @param {Address} sender
     * @param {U256} longTokenAmount
     * @returns {Promise<TransactionResult>}
     */
    withdrawLongFrom(sender, longTokenAmount) {
        _assertClass(sender, Address);
        var ptr0 = sender.__destroy_into_raw();
        _assertClass(longTokenAmount, U256);
        var ptr1 = longTokenAmount.__destroy_into_raw();
        const ret = wasm.marketwasmclient_withdrawLongFrom(this.__wbg_ptr, ptr0, ptr1);
        return takeObject(ret);
    }
    /**
     * @param {U256} shortTokenAmount
     * @returns {Promise<TransactionResult>}
     */
    withdrawShort(shortTokenAmount) {
        _assertClass(shortTokenAmount, U256);
        var ptr0 = shortTokenAmount.__destroy_into_raw();
        const ret = wasm.marketwasmclient_withdrawShort(this.__wbg_ptr, ptr0);
        return takeObject(ret);
    }
    /**
     * @param {Address} sender
     * @param {U256} shortTokenAmount
     * @returns {Promise<TransactionResult>}
     */
    withdrawShortFrom(sender, shortTokenAmount) {
        _assertClass(sender, Address);
        var ptr0 = sender.__destroy_into_raw();
        _assertClass(shortTokenAmount, U256);
        var ptr1 = shortTokenAmount.__destroy_into_raw();
        const ret = wasm.marketwasmclient_withdrawShortFrom(this.__wbg_ptr, ptr0, ptr1);
        return takeObject(ret);
    }
    /**
     * @returns {Promise<MarketState>}
     */
    getMarketState() {
        const ret = wasm.marketwasmclient_getMarketState(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @param {Config} cfg
     * @returns {Promise<TransactionResult>}
     */
    setConfig(cfg) {
        _assertClass(cfg, Config);
        var ptr0 = cfg.__destroy_into_raw();
        const ret = wasm.marketwasmclient_setConfig(this.__wbg_ptr, ptr0);
        return takeObject(ret);
    }
    /**
     * @returns {Promise<Config>}
     */
    getConfig() {
        const ret = wasm.marketwasmclient_getConfig(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @param {Address} priceFeedAddress
     * @param {string} priceFeedId
     * @returns {Promise<TransactionResult>}
     */
    setPriceFeed(priceFeedAddress, priceFeedId) {
        _assertClass(priceFeedAddress, Address);
        var ptr0 = priceFeedAddress.__destroy_into_raw();
        const ptr1 = passStringToWasm0(priceFeedId, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.marketwasmclient_setPriceFeed(this.__wbg_ptr, ptr0, ptr1, len1);
        return takeObject(ret);
    }
    /**
     * Returns comprehensive market and user data in a single call for frontend efficiency.
     * @param {Address} address
     * @returns {Promise<AddressMarketState>}
     */
    getAddressMarketState(address) {
        _assertClass(address, Address);
        var ptr0 = address.__destroy_into_raw();
        const ret = wasm.marketwasmclient_getAddressMarketState(this.__wbg_ptr, ptr0);
        return takeObject(ret);
    }
    /**
     * Delegated. See `self.access_control.has_role()` for details.
     * @param {Uint8Array} role
     * @param {Address} address
     * @returns {Promise<boolean>}
     */
    hasRole(role, address) {
        const ptr0 = passArray8ToWasm0(role, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        _assertClass(address, Address);
        var ptr1 = address.__destroy_into_raw();
        const ret = wasm.marketwasmclient_hasRole(this.__wbg_ptr, ptr0, len0, ptr1);
        return takeObject(ret);
    }
    /**
     * Delegated. See `self.access_control.grant_role()` for details.
     * @param {Uint8Array} role
     * @param {Address} address
     * @returns {Promise<TransactionResult>}
     */
    grantRole(role, address) {
        const ptr0 = passArray8ToWasm0(role, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        _assertClass(address, Address);
        var ptr1 = address.__destroy_into_raw();
        const ret = wasm.marketwasmclient_grantRole(this.__wbg_ptr, ptr0, len0, ptr1);
        return takeObject(ret);
    }
    /**
     * Delegated. See `self.access_control.revoke_role()` for details.
     * @param {Uint8Array} role
     * @param {Address} address
     * @returns {Promise<TransactionResult>}
     */
    revokeRole(role, address) {
        const ptr0 = passArray8ToWasm0(role, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        _assertClass(address, Address);
        var ptr1 = address.__destroy_into_raw();
        const ret = wasm.marketwasmclient_revokeRole(this.__wbg_ptr, ptr0, len0, ptr1);
        return takeObject(ret);
    }
    /**
     * Delegated. See `self.access_control.get_role_admin()` for details.
     * @param {Uint8Array} role
     * @returns {Promise<Uint8Array>}
     */
    getRoleAdmin(role) {
        const ptr0 = passArray8ToWasm0(role, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.marketwasmclient_getRoleAdmin(this.__wbg_ptr, ptr0, len0);
        return takeObject(ret);
    }
    /**
     * Delegated. See `self.access_control.renounce_role()` for details.
     * @param {Uint8Array} role
     * @param {Address} address
     * @returns {Promise<TransactionResult>}
     */
    renounceRole(role, address) {
        const ptr0 = passArray8ToWasm0(role, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        _assertClass(address, Address);
        var ptr1 = address.__destroy_into_raw();
        const ret = wasm.marketwasmclient_renounceRole(this.__wbg_ptr, ptr0, len0, ptr1);
        return takeObject(ret);
    }
}

const MintFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_mint_free(ptr >>> 0, 1));

export class Mint {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        MintFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_mint_free(ptr, 0);
    }
    /**
     * @param {Address} recipient
     * @param {U256} amount
     */
    constructor(recipient, amount) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(recipient, Address);
            var ptr0 = recipient.__destroy_into_raw();
            _assertClass(amount, U256);
            var ptr1 = amount.__destroy_into_raw();
            wasm.burn_new(retptr, ptr0, ptr1);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            this.__wbg_ptr = r0 >>> 0;
            MintFinalization.register(this, this.__wbg_ptr, this);
            return this;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {any}
     */
    toJson() {
        const ret = wasm.mint_toJson(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @param {Address} value
     */
    set recipient(value) {
        _assertClass(value, Address);
        var ptr0 = value.__destroy_into_raw();
        wasm.mint_set_recipient(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {Address}
     */
    get recipient() {
        const ret = wasm.burn_owner(this.__wbg_ptr);
        return Address.__wrap(ret);
    }
    /**
     * @param {U256} value
     */
    set amount(value) {
        _assertClass(value, U256);
        var ptr0 = value.__destroy_into_raw();
        wasm.mint_set_amount(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {U256}
     */
    get amount() {
        const ret = wasm.burn_amount(this.__wbg_ptr);
        return U256.__wrap(ret);
    }
}

const OdraWasmClientFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_odrawasmclient_free(ptr >>> 0, 1));

export class OdraWasmClient {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        OdraWasmClientFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_odrawasmclient_free(ptr, 0);
    }
    /**
     * @param {string} node_address
     * @param {string} speculative_node_address
     * @param {string | null} [chain_name]
     * @param {number | null} [ttl]
     * @param {Verbosity | null} [verbosity]
     */
    constructor(node_address, speculative_node_address, chain_name, ttl, verbosity) {
        const ptr0 = passStringToWasm0(node_address, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(speculative_node_address, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
        const len1 = WASM_VECTOR_LEN;
        var ptr2 = isLikeNone(chain_name) ? 0 : passStringToWasm0(chain_name, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
        var len2 = WASM_VECTOR_LEN;
        const ret = wasm.odrawasmclient_new(ptr0, len0, ptr1, len1, ptr2, len2, isLikeNone(ttl) ? 0x100000001 : (ttl) >>> 0, isLikeNone(verbosity) ? 3 : verbosity);
        this.__wbg_ptr = ret >>> 0;
        OdraWasmClientFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Returns the balance of the specified address.
     * @param {Address} address
     * @returns {Promise<U512>}
     */
    getBalance(address) {
        _assertClass(address, Address);
        const ret = wasm.odrawasmclient_getBalance(this.__wbg_ptr, address.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * Returns the balance of the specified address.
     * @returns {Promise<U512>}
     */
    getCallerBalance() {
        const ret = wasm.odrawasmclient_getCallerBalance(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * Returns the balance of the specified address.
     * @returns {Promise<Address>}
     */
    caller() {
        const ret = wasm.odrawasmclient_caller(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * Transfers the specified amount to the given address.
     * @param {Address} to
     * @param {U512} amount
     * @returns {Promise<TransactionHash>}
     */
    transfer(to, amount) {
        _assertClass(to, Address);
        _assertClass(amount, U512);
        const ret = wasm.odrawasmclient_transfer(this.__wbg_ptr, to.__wbg_ptr, amount.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * Call the connect() method using a provider name as the first parameter to request a connection using that wallet
     * or login mechanism.
     *
     * Some providers may need an options argument to indicate the connection behavior requested.
     * @param {string} provider
     * @returns {Promise<AccountInfo>}
     */
    connect(provider) {
        const ptr0 = passStringToWasm0(provider, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.odrawasmclient_connect(this.__wbg_ptr, ptr0, len0);
        return takeObject(ret);
    }
    /**
     * Triggers a request to a UI library to show a sign-in dialog.
     * @returns {Promise<void>}
     */
    signIn() {
        const ret = wasm.odrawasmclient_signIn(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * Closes an active session in your dApp.
     *
     * Triggers the [Event::SignedOut](crate::cspr_click::event::Event::SignedOut) event.
     * @returns {Promise<void>}
     */
    signOut() {
        const ret = wasm.odrawasmclient_signOut(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * Usually you will call signOut() method to close a user session. Use disconnect() when you want to clear
     * the connection between the wallet and your app. Next time the user signs in with that wallet, he'll
     * must grant connection permission again.
     * @returns {Promise<boolean>}
     */
    disconnect() {
        const ret = wasm.odrawasmclient_disconnect(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * Starts a session with the indicated account. This account must be one of the accounts returned
     * in getKnownAccounts or getSignInOptions.
     *
     * Note that no interaction with the account provider is required to sign-in. CSPR.click will check and restore
     * the connection if needed when there's a transaction or message to sign.
     * @param {AccountInfo} account
     * @returns {Promise<AccountInfo>}
     */
    signInWithAccount(account) {
        _assertClass(account, AccountInfo);
        const ret = wasm.odrawasmclient_signInWithAccount(this.__wbg_ptr, account.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * Returns true if the provider is unlocked. false if the provider is locked.
     * @param {string} provider
     * @returns {Promise<boolean>}
     */
    isUnlocked(provider) {
        const ptr0 = passStringToWasm0(provider, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.odrawasmclient_isUnlocked(this.__wbg_ptr, ptr0, len0);
        return takeObject(ret);
    }
    /**
     * Gets the public key for the current session (if any).
     * @returns {Promise<string>}
     */
    getActivePublicKey() {
        const ret = wasm.odrawasmclient_getActivePublicKey(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * Gets the account for the current session (if any).
     * @returns {Promise<AccountInfo>}
     */
    getActiveAccount() {
        const ret = wasm.odrawasmclient_getActiveAccount(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * Call this method to request CSPR.click UI to show the Switch Account modal window.
     * @returns {Promise<void>}
     */
    switchAccount() {
        const ret = wasm.odrawasmclient_switchAccount(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * Triggers the mechanisms to request your user to sign a text message with the active wallet.
     * @param {string} message
     * @returns {Promise<SignResult>}
     */
    signMessage(message) {
        const ptr0 = passStringToWasm0(message, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.odrawasmclient_signMessage(this.__wbg_ptr, ptr0, len0);
        return takeObject(ret);
    }
}

const OverflowingResultU128Finalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_overflowingresultu128_free(ptr >>> 0, 1));

export class OverflowingResultU128 {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(OverflowingResultU128.prototype);
        obj.__wbg_ptr = ptr;
        OverflowingResultU128Finalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        OverflowingResultU128Finalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_overflowingresultu128_free(ptr, 0);
    }
    /**
     * @returns {U128}
     */
    get result() {
        const ret = wasm.__wbg_get_overflowingresultu128_result(this.__wbg_ptr);
        return U128.__wrap(ret);
    }
    /**
     * @returns {boolean}
     */
    get overflow() {
        const ret = wasm.__wbg_get_overflowingresultu128_overflow(this.__wbg_ptr);
        return ret !== 0;
    }
}

const OverflowingResultU256Finalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_overflowingresultu256_free(ptr >>> 0, 1));

export class OverflowingResultU256 {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(OverflowingResultU256.prototype);
        obj.__wbg_ptr = ptr;
        OverflowingResultU256Finalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        OverflowingResultU256Finalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_overflowingresultu256_free(ptr, 0);
    }
    /**
     * @returns {U256}
     */
    get result() {
        const ret = wasm.__wbg_get_overflowingresultu256_result(this.__wbg_ptr);
        return U256.__wrap(ret);
    }
    /**
     * @returns {boolean}
     */
    get overflow() {
        const ret = wasm.__wbg_get_overflowingresultu256_overflow(this.__wbg_ptr);
        return ret !== 0;
    }
}

const OverflowingResultU512Finalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_overflowingresultu512_free(ptr >>> 0, 1));

export class OverflowingResultU512 {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(OverflowingResultU512.prototype);
        obj.__wbg_ptr = ptr;
        OverflowingResultU512Finalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        OverflowingResultU512Finalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_overflowingresultu512_free(ptr, 0);
    }
    /**
     * @returns {U512}
     */
    get result() {
        const ret = wasm.__wbg_get_overflowingresultu512_result(this.__wbg_ptr);
        return U512.__wrap(ret);
    }
    /**
     * @returns {boolean}
     */
    get overflow() {
        const ret = wasm.__wbg_get_overflowingresultu512_overflow(this.__wbg_ptr);
        return ret !== 0;
    }
}

const PausedFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_paused_free(ptr >>> 0, 1));

export class Paused {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PausedFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_paused_free(ptr, 0);
    }
    /**
     * @param {Address} account
     */
    constructor(account) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(account, Address);
            var ptr0 = account.__destroy_into_raw();
            wasm.paused_new(retptr, ptr0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            this.__wbg_ptr = r0 >>> 0;
            PausedFinalization.register(this, this.__wbg_ptr, this);
            return this;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {any}
     */
    toJson() {
        const ret = wasm.paused_toJson(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @param {Address} value
     */
    set account(value) {
        _assertClass(value, Address);
        var ptr0 = value.__destroy_into_raw();
        wasm.paused_set_account(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {Address}
     */
    get account() {
        const ret = wasm.paused_account(this.__wbg_ptr);
        return Address.__wrap(ret);
    }
}

const PositionTokenWasmClientFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_positiontokenwasmclient_free(ptr >>> 0, 1));

export class PositionTokenWasmClient {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PositionTokenWasmClientFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_positiontokenwasmclient_free(ptr, 0);
    }
    /**
     * @param {OdraWasmClient} wasmClient
     * @param {Address} address
     */
    constructor(wasmClient, address) {
        _assertClass(wasmClient, OdraWasmClient);
        _assertClass(address, Address);
        var ptr0 = address.__destroy_into_raw();
        const ret = wasm.faucetablewcsprwasmclient_new(wasmClient.__wbg_ptr, ptr0);
        this.__wbg_ptr = ret >>> 0;
        PositionTokenWasmClientFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {Address} recipient
     * @param {U256} amount
     * @returns {Promise<TransactionResult>}
     */
    transfer(recipient, amount) {
        _assertClass(recipient, Address);
        var ptr0 = recipient.__destroy_into_raw();
        _assertClass(amount, U256);
        var ptr1 = amount.__destroy_into_raw();
        const ret = wasm.positiontokenwasmclient_transfer(this.__wbg_ptr, ptr0, ptr1);
        return takeObject(ret);
    }
    /**
     * @param {Address} owner
     * @param {Address} recipient
     * @param {U256} amount
     * @returns {Promise<TransactionResult>}
     */
    transferFrom(owner, recipient, amount) {
        _assertClass(owner, Address);
        var ptr0 = owner.__destroy_into_raw();
        _assertClass(recipient, Address);
        var ptr1 = recipient.__destroy_into_raw();
        _assertClass(amount, U256);
        var ptr2 = amount.__destroy_into_raw();
        const ret = wasm.positiontokenwasmclient_transferFrom(this.__wbg_ptr, ptr0, ptr1, ptr2);
        return takeObject(ret);
    }
    /**
     * Burns the given amount of tokens from the given address.
     * @param {Address} owner
     * @param {U256} amount
     * @returns {Promise<TransactionResult>}
     */
    burn(owner, amount) {
        _assertClass(owner, Address);
        var ptr0 = owner.__destroy_into_raw();
        _assertClass(amount, U256);
        var ptr1 = amount.__destroy_into_raw();
        const ret = wasm.positiontokenwasmclient_burn(this.__wbg_ptr, ptr0, ptr1);
        return takeObject(ret);
    }
    /**
     * @param {Address} to
     * @param {U256} amount
     * @returns {Promise<TransactionResult>}
     */
    mint(to, amount) {
        _assertClass(to, Address);
        var ptr0 = to.__destroy_into_raw();
        _assertClass(amount, U256);
        var ptr1 = amount.__destroy_into_raw();
        const ret = wasm.positiontokenwasmclient_mint(this.__wbg_ptr, ptr0, ptr1);
        return takeObject(ret);
    }
    /**
     * @returns {Promise<LongOrShort>}
     */
    longOrShort() {
        const ret = wasm.positiontokenwasmclient_longOrShort(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @returns {Promise<TransactionResult>}
     */
    disablePeerTransfers() {
        const ret = wasm.positiontokenwasmclient_disablePeerTransfers(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @returns {Promise<TransactionResult>}
     */
    enablePeerTransfers() {
        const ret = wasm.positiontokenwasmclient_enablePeerTransfers(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * Returns the name of the token.
     * @returns {Promise<string>}
     */
    name() {
        const ret = wasm.positiontokenwasmclient_name(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * Returns the symbol of the token.
     * @returns {Promise<string>}
     */
    symbol() {
        const ret = wasm.positiontokenwasmclient_symbol(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * Returns the number of decimals the token uses.
     * @returns {Promise<number>}
     */
    decimals() {
        const ret = wasm.positiontokenwasmclient_decimals(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * Returns the total supply of the token.
     * @returns {Promise<U256>}
     */
    totalSupply() {
        const ret = wasm.positiontokenwasmclient_totalSupply(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * Returns the balance of the given address.
     * @param {Address} address
     * @returns {Promise<U256>}
     */
    balanceOf(address) {
        _assertClass(address, Address);
        var ptr0 = address.__destroy_into_raw();
        const ret = wasm.positiontokenwasmclient_balanceOf(this.__wbg_ptr, ptr0);
        return takeObject(ret);
    }
    /**
     * Returns the amount of tokens the owner has allowed the spender to spend.
     * @param {Address} owner
     * @param {Address} spender
     * @returns {Promise<U256>}
     */
    allowance(owner, spender) {
        _assertClass(owner, Address);
        var ptr0 = owner.__destroy_into_raw();
        _assertClass(spender, Address);
        var ptr1 = spender.__destroy_into_raw();
        const ret = wasm.positiontokenwasmclient_allowance(this.__wbg_ptr, ptr0, ptr1);
        return takeObject(ret);
    }
    /**
     * Approves the spender to spend the given amount of tokens on behalf of the caller.
     * @param {Address} spender
     * @param {U256} amount
     * @returns {Promise<TransactionResult>}
     */
    approve(spender, amount) {
        _assertClass(spender, Address);
        var ptr0 = spender.__destroy_into_raw();
        _assertClass(amount, U256);
        var ptr1 = amount.__destroy_into_raw();
        const ret = wasm.positiontokenwasmclient_approve(this.__wbg_ptr, ptr0, ptr1);
        return takeObject(ret);
    }
    /**
     * Decreases the allowance of the spender by the given amount.
     * @param {Address} spender
     * @param {U256} decrBy
     * @returns {Promise<TransactionResult>}
     */
    decreaseAllowance(spender, decrBy) {
        _assertClass(spender, Address);
        var ptr0 = spender.__destroy_into_raw();
        _assertClass(decrBy, U256);
        var ptr1 = decrBy.__destroy_into_raw();
        const ret = wasm.positiontokenwasmclient_decreaseAllowance(this.__wbg_ptr, ptr0, ptr1);
        return takeObject(ret);
    }
    /**
     * Increases the allowance of the spender by the given amount.
     * @param {Address} spender
     * @param {U256} incBy
     * @returns {Promise<TransactionResult>}
     */
    increaseAllowance(spender, incBy) {
        _assertClass(spender, Address);
        var ptr0 = spender.__destroy_into_raw();
        _assertClass(incBy, U256);
        var ptr1 = incBy.__destroy_into_raw();
        const ret = wasm.positiontokenwasmclient_increaseAllowance(this.__wbg_ptr, ptr0, ptr1);
        return takeObject(ret);
    }
}

const PriceFeedUpdatedFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_pricefeedupdated_free(ptr >>> 0, 1));

export class PriceFeedUpdated {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PriceFeedUpdatedFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_pricefeedupdated_free(ptr, 0);
    }
    /**
     * @returns {string}
     */
    get priceFeedId() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_pricefeedupdated_priceFeedId(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_4(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {string} arg0
     */
    set priceFeedId(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_pricefeedupdated_priceFeedId(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {Address} admin
     * @param {Address} priceFeedAddress
     * @param {string} priceFeedId
     */
    constructor(admin, priceFeedAddress, priceFeedId) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(admin, Address);
            var ptr0 = admin.__destroy_into_raw();
            _assertClass(priceFeedAddress, Address);
            var ptr1 = priceFeedAddress.__destroy_into_raw();
            const ptr2 = passStringToWasm0(priceFeedId, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
            const len2 = WASM_VECTOR_LEN;
            wasm.pricefeedupdated_new(retptr, ptr0, ptr1, ptr2, len2);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            this.__wbg_ptr = r0 >>> 0;
            PriceFeedUpdatedFinalization.register(this, this.__wbg_ptr, this);
            return this;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {any}
     */
    toJson() {
        const ret = wasm.pricefeedupdated_toJson(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @param {Address} value
     */
    set admin(value) {
        _assertClass(value, Address);
        var ptr0 = value.__destroy_into_raw();
        wasm.pricefeedupdated_set_admin(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {Address}
     */
    get admin() {
        const ret = wasm.pricefeedupdated_admin(this.__wbg_ptr);
        return Address.__wrap(ret);
    }
    /**
     * @param {Address} value
     */
    set price_feed_address(value) {
        _assertClass(value, Address);
        var ptr0 = value.__destroy_into_raw();
        wasm.pricefeedupdated_set_price_feed_address(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {Address}
     */
    get price_feed_address() {
        const ret = wasm.pricefeedupdated_price_feed_address(this.__wbg_ptr);
        return Address.__wrap(ret);
    }
}

const PriceUpdatedFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_priceupdated_free(ptr >>> 0, 1));

export class PriceUpdated {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PriceUpdatedFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_priceupdated_free(ptr, 0);
    }
    /**
     * @returns {bigint}
     */
    get timestamp() {
        const ret = wasm.__wbg_get_priceupdated_timestamp(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * @param {bigint} arg0
     */
    set timestamp(arg0) {
        wasm.__wbg_set_priceupdated_timestamp(this.__wbg_ptr, arg0);
    }
    /**
     * @param {U256} newPrice
     * @param {U256} previousPrice
     * @param {bigint} timestamp
     */
    constructor(newPrice, previousPrice, timestamp) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(newPrice, U256);
            var ptr0 = newPrice.__destroy_into_raw();
            _assertClass(previousPrice, U256);
            var ptr1 = previousPrice.__destroy_into_raw();
            wasm.priceupdated_new(retptr, ptr0, ptr1, timestamp);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            this.__wbg_ptr = r0 >>> 0;
            PriceUpdatedFinalization.register(this, this.__wbg_ptr, this);
            return this;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {any}
     */
    toJson() {
        const ret = wasm.priceupdated_toJson(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @param {U256} value
     */
    set new_price(value) {
        _assertClass(value, U256);
        var ptr0 = value.__destroy_into_raw();
        wasm.priceupdated_set_new_price(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {U256}
     */
    get new_price() {
        const ret = wasm.burn_amount(this.__wbg_ptr);
        return U256.__wrap(ret);
    }
    /**
     * @param {U256} value
     */
    set previous_price(value) {
        _assertClass(value, U256);
        var ptr0 = value.__destroy_into_raw();
        wasm.priceupdated_set_previous_price(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {U256}
     */
    get previous_price() {
        const ret = wasm.priceupdated_previous_price(this.__wbg_ptr);
        return U256.__wrap(ret);
    }
}

const PublicKeyFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_publickey_free(ptr >>> 0, 1));

export class PublicKey {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(PublicKey.prototype);
        obj.__wbg_ptr = ptr;
        PublicKeyFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PublicKeyFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_publickey_free(ptr, 0);
    }
    /**
     * @param {string} public_key_hex_str
     */
    constructor(public_key_hex_str) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(public_key_hex_str, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
            const len0 = WASM_VECTOR_LEN;
            wasm.publickey_new_js_alias(retptr, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            this.__wbg_ptr = r0 >>> 0;
            PublicKeyFinalization.register(this, this.__wbg_ptr, this);
            return this;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {PublicKey}
     */
    static fromUint8Array(bytes) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_export_1);
            const len0 = WASM_VECTOR_LEN;
            wasm.publickey_fromUint8Array(retptr, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return PublicKey.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {any}
     */
    toJson() {
        const ret = wasm.publickey_toJson(this.__wbg_ptr);
        return takeObject(ret);
    }
}

const RoleAdminChangedFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_roleadminchanged_free(ptr >>> 0, 1));

export class RoleAdminChanged {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        RoleAdminChangedFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_roleadminchanged_free(ptr, 0);
    }
    /**
     * @returns {Uint8Array}
     */
    get role() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_roleadminchanged_role(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export_4(r0, r1 * 1, 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} arg0
     */
    set role(arg0) {
        const ptr0 = passArray8ToWasm0(arg0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_pricefeedupdated_priceFeedId(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {Uint8Array}
     */
    get previousAdminRole() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_roleadminchanged_previousAdminRole(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export_4(r0, r1 * 1, 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} arg0
     */
    set previousAdminRole(arg0) {
        const ptr0 = passArray8ToWasm0(arg0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_roleadminchanged_previousAdminRole(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {Uint8Array}
     */
    get newAdminRole() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_roleadminchanged_newAdminRole(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export_4(r0, r1 * 1, 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} arg0
     */
    set newAdminRole(arg0) {
        const ptr0 = passArray8ToWasm0(arg0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_roleadminchanged_newAdminRole(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {Uint8Array} role
     * @param {Uint8Array} previousAdminRole
     * @param {Uint8Array} newAdminRole
     */
    constructor(role, previousAdminRole, newAdminRole) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(role, wasm.__wbindgen_export_1);
            const len0 = WASM_VECTOR_LEN;
            const ptr1 = passArray8ToWasm0(previousAdminRole, wasm.__wbindgen_export_1);
            const len1 = WASM_VECTOR_LEN;
            const ptr2 = passArray8ToWasm0(newAdminRole, wasm.__wbindgen_export_1);
            const len2 = WASM_VECTOR_LEN;
            wasm.roleadminchanged_new(retptr, ptr0, len0, ptr1, len1, ptr2, len2);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            this.__wbg_ptr = r0 >>> 0;
            RoleAdminChangedFinalization.register(this, this.__wbg_ptr, this);
            return this;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {any}
     */
    toJson() {
        const ret = wasm.roleadminchanged_toJson(this.__wbg_ptr);
        return takeObject(ret);
    }
}

const RoleGrantedFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_rolegranted_free(ptr >>> 0, 1));

export class RoleGranted {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        RoleGrantedFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_rolegranted_free(ptr, 0);
    }
    /**
     * @returns {Uint8Array}
     */
    get role() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_rolegranted_role(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export_4(r0, r1 * 1, 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} arg0
     */
    set role(arg0) {
        const ptr0 = passArray8ToWasm0(arg0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_pricefeedupdated_priceFeedId(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {Uint8Array} role
     * @param {Address} address
     * @param {Address} sender
     */
    constructor(role, address, sender) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(role, wasm.__wbindgen_export_1);
            const len0 = WASM_VECTOR_LEN;
            _assertClass(address, Address);
            var ptr1 = address.__destroy_into_raw();
            _assertClass(sender, Address);
            var ptr2 = sender.__destroy_into_raw();
            wasm.rolegranted_new(retptr, ptr0, len0, ptr1, ptr2);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            this.__wbg_ptr = r0 >>> 0;
            RoleGrantedFinalization.register(this, this.__wbg_ptr, this);
            return this;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {any}
     */
    toJson() {
        const ret = wasm.rolegranted_toJson(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @param {Address} value
     */
    set address(value) {
        _assertClass(value, Address);
        var ptr0 = value.__destroy_into_raw();
        wasm.rolegranted_set_address(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {Address}
     */
    get address() {
        const ret = wasm.pricefeedupdated_admin(this.__wbg_ptr);
        return Address.__wrap(ret);
    }
    /**
     * @param {Address} value
     */
    set sender(value) {
        _assertClass(value, Address);
        var ptr0 = value.__destroy_into_raw();
        wasm.rolegranted_set_sender(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {Address}
     */
    get sender() {
        const ret = wasm.pricefeedupdated_price_feed_address(this.__wbg_ptr);
        return Address.__wrap(ret);
    }
}

const RoleRevokedFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_rolerevoked_free(ptr >>> 0, 1));

export class RoleRevoked {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        RoleRevokedFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_rolerevoked_free(ptr, 0);
    }
    /**
     * @returns {Uint8Array}
     */
    get role() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_rolerevoked_role(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export_4(r0, r1 * 1, 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} arg0
     */
    set role(arg0) {
        const ptr0 = passArray8ToWasm0(arg0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_pricefeedupdated_priceFeedId(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {Uint8Array} role
     * @param {Address} address
     * @param {Address} sender
     */
    constructor(role, address, sender) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(role, wasm.__wbindgen_export_1);
            const len0 = WASM_VECTOR_LEN;
            _assertClass(address, Address);
            var ptr1 = address.__destroy_into_raw();
            _assertClass(sender, Address);
            var ptr2 = sender.__destroy_into_raw();
            wasm.rolegranted_new(retptr, ptr0, len0, ptr1, ptr2);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            this.__wbg_ptr = r0 >>> 0;
            RoleRevokedFinalization.register(this, this.__wbg_ptr, this);
            return this;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {any}
     */
    toJson() {
        const ret = wasm.rolegranted_toJson(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @param {Address} value
     */
    set address(value) {
        _assertClass(value, Address);
        var ptr0 = value.__destroy_into_raw();
        wasm.rolerevoked_set_address(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {Address}
     */
    get address() {
        const ret = wasm.pricefeedupdated_admin(this.__wbg_ptr);
        return Address.__wrap(ret);
    }
    /**
     * @param {Address} value
     */
    set sender(value) {
        _assertClass(value, Address);
        var ptr0 = value.__destroy_into_raw();
        wasm.rolerevoked_set_sender(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {Address}
     */
    get sender() {
        const ret = wasm.pricefeedupdated_price_feed_address(this.__wbg_ptr);
        return Address.__wrap(ret);
    }
}

const SetAllowanceFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_setallowance_free(ptr >>> 0, 1));

export class SetAllowance {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SetAllowanceFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_setallowance_free(ptr, 0);
    }
    /**
     * @param {Address} owner
     * @param {Address} spender
     * @param {U256} allowance
     */
    constructor(owner, spender, allowance) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(owner, Address);
            var ptr0 = owner.__destroy_into_raw();
            _assertClass(spender, Address);
            var ptr1 = spender.__destroy_into_raw();
            _assertClass(allowance, U256);
            var ptr2 = allowance.__destroy_into_raw();
            wasm.setallowance_new(retptr, ptr0, ptr1, ptr2);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            this.__wbg_ptr = r0 >>> 0;
            SetAllowanceFinalization.register(this, this.__wbg_ptr, this);
            return this;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {any}
     */
    toJson() {
        const ret = wasm.setallowance_toJson(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @param {Address} value
     */
    set owner(value) {
        _assertClass(value, Address);
        var ptr0 = value.__destroy_into_raw();
        wasm.setallowance_set_owner(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {Address}
     */
    get owner() {
        const ret = wasm.setallowance_owner(this.__wbg_ptr);
        return Address.__wrap(ret);
    }
    /**
     * @param {Address} value
     */
    set spender(value) {
        _assertClass(value, Address);
        var ptr0 = value.__destroy_into_raw();
        wasm.setallowance_set_spender(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {Address}
     */
    get spender() {
        const ret = wasm.setallowance_spender(this.__wbg_ptr);
        return Address.__wrap(ret);
    }
    /**
     * @param {U256} value
     */
    set allowance(value) {
        _assertClass(value, U256);
        var ptr0 = value.__destroy_into_raw();
        wasm.setallowance_set_allowance(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {U256}
     */
    get allowance() {
        const ret = wasm.setallowance_allowance(this.__wbg_ptr);
        return U256.__wrap(ret);
    }
}

const ShortDepositedFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_shortdeposited_free(ptr >>> 0, 1));

export class ShortDeposited {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ShortDepositedFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_shortdeposited_free(ptr, 0);
    }
    /**
     * @param {Address} user
     * @param {U256} wcsprAmount
     * @param {U256} shortTokensMinted
     * @param {U256} feeCollected
     */
    constructor(user, wcsprAmount, shortTokensMinted, feeCollected) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(user, Address);
            var ptr0 = user.__destroy_into_raw();
            _assertClass(wcsprAmount, U256);
            var ptr1 = wcsprAmount.__destroy_into_raw();
            _assertClass(shortTokensMinted, U256);
            var ptr2 = shortTokensMinted.__destroy_into_raw();
            _assertClass(feeCollected, U256);
            var ptr3 = feeCollected.__destroy_into_raw();
            wasm.longdeposited_new(retptr, ptr0, ptr1, ptr2, ptr3);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            this.__wbg_ptr = r0 >>> 0;
            ShortDepositedFinalization.register(this, this.__wbg_ptr, this);
            return this;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {any}
     */
    toJson() {
        const ret = wasm.shortdeposited_toJson(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @param {Address} value
     */
    set user(value) {
        _assertClass(value, Address);
        var ptr0 = value.__destroy_into_raw();
        wasm.shortdeposited_set_user(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {Address}
     */
    get user() {
        const ret = wasm.longdeposited_user(this.__wbg_ptr);
        return Address.__wrap(ret);
    }
    /**
     * @param {U256} value
     */
    set wcspr_amount(value) {
        _assertClass(value, U256);
        var ptr0 = value.__destroy_into_raw();
        wasm.shortdeposited_set_wcspr_amount(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {U256}
     */
    get wcspr_amount() {
        const ret = wasm.decreaseallowance_allowance(this.__wbg_ptr);
        return U256.__wrap(ret);
    }
    /**
     * @param {U256} value
     */
    set short_tokens_minted(value) {
        _assertClass(value, U256);
        var ptr0 = value.__destroy_into_raw();
        wasm.shortdeposited_set_short_tokens_minted(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {U256}
     */
    get short_tokens_minted() {
        const ret = wasm.decreaseallowance_decr_by(this.__wbg_ptr);
        return U256.__wrap(ret);
    }
    /**
     * @param {U256} value
     */
    set fee_collected(value) {
        _assertClass(value, U256);
        var ptr0 = value.__destroy_into_raw();
        wasm.shortdeposited_set_fee_collected(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {U256}
     */
    get fee_collected() {
        const ret = wasm.longdeposited_fee_collected(this.__wbg_ptr);
        return U256.__wrap(ret);
    }
}

const ShortWithdrawnFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_shortwithdrawn_free(ptr >>> 0, 1));

export class ShortWithdrawn {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ShortWithdrawnFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_shortwithdrawn_free(ptr, 0);
    }
    /**
     * @param {Address} user
     * @param {U256} shortTokensBurned
     * @param {U256} wcsprAmount
     * @param {U256} feeCollected
     */
    constructor(user, shortTokensBurned, wcsprAmount, feeCollected) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(user, Address);
            var ptr0 = user.__destroy_into_raw();
            _assertClass(shortTokensBurned, U256);
            var ptr1 = shortTokensBurned.__destroy_into_raw();
            _assertClass(wcsprAmount, U256);
            var ptr2 = wcsprAmount.__destroy_into_raw();
            _assertClass(feeCollected, U256);
            var ptr3 = feeCollected.__destroy_into_raw();
            wasm.longdeposited_new(retptr, ptr0, ptr1, ptr2, ptr3);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            this.__wbg_ptr = r0 >>> 0;
            ShortWithdrawnFinalization.register(this, this.__wbg_ptr, this);
            return this;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {any}
     */
    toJson() {
        const ret = wasm.shortwithdrawn_toJson(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @param {Address} value
     */
    set user(value) {
        _assertClass(value, Address);
        var ptr0 = value.__destroy_into_raw();
        wasm.shortwithdrawn_set_user(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {Address}
     */
    get user() {
        const ret = wasm.longdeposited_user(this.__wbg_ptr);
        return Address.__wrap(ret);
    }
    /**
     * @param {U256} value
     */
    set short_tokens_burned(value) {
        _assertClass(value, U256);
        var ptr0 = value.__destroy_into_raw();
        wasm.shortwithdrawn_set_short_tokens_burned(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {U256}
     */
    get short_tokens_burned() {
        const ret = wasm.decreaseallowance_allowance(this.__wbg_ptr);
        return U256.__wrap(ret);
    }
    /**
     * @param {U256} value
     */
    set wcspr_amount(value) {
        _assertClass(value, U256);
        var ptr0 = value.__destroy_into_raw();
        wasm.shortwithdrawn_set_wcspr_amount(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {U256}
     */
    get wcspr_amount() {
        const ret = wasm.decreaseallowance_decr_by(this.__wbg_ptr);
        return U256.__wrap(ret);
    }
    /**
     * @param {U256} value
     */
    set fee_collected(value) {
        _assertClass(value, U256);
        var ptr0 = value.__destroy_into_raw();
        wasm.shortwithdrawn_set_fee_collected(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {U256}
     */
    get fee_collected() {
        const ret = wasm.longdeposited_fee_collected(this.__wbg_ptr);
        return U256.__wrap(ret);
    }
}

const SignResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_signresult_free(ptr >>> 0, 1));

export class SignResult {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(SignResult.prototype);
        obj.__wbg_ptr = ptr;
        SignResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SignResultFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_signresult_free(ptr, 0);
    }
    /**
     * @returns {boolean}
     */
    get is_cancelled() {
        const ret = wasm.__wbg_get_signresult_is_cancelled(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {boolean} arg0
     */
    set is_cancelled(arg0) {
        wasm.__wbg_set_signresult_is_cancelled(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {string | undefined}
     */
    get signature_hex() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_signresult_signature_hex(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            let v1;
            if (r0 !== 0) {
                v1 = getStringFromWasm0(r0, r1).slice();
                wasm.__wbindgen_export_4(r0, r1 * 1, 1);
            }
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {string | null} [arg0]
     */
    set signature_hex(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_signresult_signature_hex(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {Uint8Array}
     */
    get signature() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_signresult_signature(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export_4(r0, r1 * 1, 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} arg0
     */
    set signature(arg0) {
        const ptr0 = passArray8ToWasm0(arg0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_signresult_signature(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {Transaction | undefined}
     */
    get transaction() {
        const ret = wasm.__wbg_get_signresult_transaction(this.__wbg_ptr);
        return ret === 0 ? undefined : Transaction.__wrap(ret);
    }
    /**
     * @param {Transaction | null} [arg0]
     */
    set transaction(arg0) {
        let ptr0 = 0;
        if (!isLikeNone(arg0)) {
            _assertClass(arg0, Transaction);
            ptr0 = arg0.__destroy_into_raw();
        }
        wasm.__wbg_set_signresult_transaction(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {string | undefined}
     */
    get error() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_signresult_error(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            let v1;
            if (r0 !== 0) {
                v1 = getStringFromWasm0(r0, r1).slice();
                wasm.__wbindgen_export_4(r0, r1 * 1, 1);
            }
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {string | null} [arg0]
     */
    set error(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_signresult_error(this.__wbg_ptr, ptr0, len0);
    }
}

const TransactionFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_transaction_free(ptr >>> 0, 1));

export class Transaction {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Transaction.prototype);
        obj.__wbg_ptr = ptr;
        TransactionFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        TransactionFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_transaction_free(ptr, 0);
    }
    /**
     * @param {any} transaction
     */
    constructor(transaction) {
        const ret = wasm.transaction_new(addHeapObject(transaction));
        this.__wbg_ptr = ret >>> 0;
        TransactionFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {any}
     */
    toJson() {
        const ret = wasm.transaction_toJson(this.__wbg_ptr);
        return takeObject(ret);
    }
}

const TransactionDataFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_transactiondata_free(ptr >>> 0, 1));

export class TransactionData {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(TransactionData.prototype);
        obj.__wbg_ptr = ptr;
        TransactionDataFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        TransactionDataFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_transactiondata_free(ptr, 0);
    }
    /**
     * @returns {string}
     */
    get blockHash() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_transactiondata_blockHash(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_4(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {bigint}
     */
    get blockHeight() {
        const ret = wasm.__wbg_get_transactiondata_blockHeight(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * @returns {string}
     */
    get callerHash() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_transactiondata_callerHash(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_4(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string | undefined}
     */
    get callerPublicKey() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_transactiondata_callerPublicKey(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            let v1;
            if (r0 !== 0) {
                v1 = getStringFromWasm0(r0, r1).slice();
                wasm.__wbindgen_export_4(r0, r1 * 1, 1);
            }
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {string}
     */
    get consumedGas() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_transactiondata_consumedGas(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_4(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get contractHash() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_transactiondata_contractHash(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_4(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get contractPackageHash() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_transactiondata_contractPackageHash(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_4(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get cost() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_transactiondata_cost(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_4(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get deployHash() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_transactiondata_deployHash(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_4(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {bigint}
     */
    get entryPointId() {
        const ret = wasm.__wbg_get_transactiondata_entryPointId(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * @returns {string | undefined}
     */
    get errorMessage() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_transactiondata_errorMessage(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            let v1;
            if (r0 !== 0) {
                v1 = getStringFromWasm0(r0, r1).slice();
                wasm.__wbindgen_export_4(r0, r1 * 1, 1);
            }
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {bigint}
     */
    get executionTypeId() {
        const ret = wasm.__wbg_get_accountinfo_connectedAt(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * @returns {bigint}
     */
    get gasPriceLimit() {
        const ret = wasm.__wbg_get_transactiondata_gasPriceLimit(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * @returns {boolean}
     */
    get isStandardPayment() {
        const ret = wasm.__wbg_get_transactiondata_isStandardPayment(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {string}
     */
    get paymentAmount() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_transactiondata_paymentAmount(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_4(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {bigint}
     */
    get pricingModeId() {
        const ret = wasm.__wbg_get_transactiondata_pricingModeId(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * @returns {string}
     */
    get refundAmount() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_transactiondata_refundAmount(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_4(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {bigint}
     */
    get runtimeTypeId() {
        const ret = wasm.__wbg_get_transactiondata_runtimeTypeId(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * @returns {TransactionStatus}
     */
    get status() {
        const ret = wasm.__wbg_get_transactiondata_status(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {string}
     */
    get timestamp() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_transactiondata_timestamp(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_4(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {bigint}
     */
    get versionId() {
        const ret = wasm.__wbg_get_transactiondata_versionId(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * @returns {any}
     */
    get args() {
        const ret = wasm.transactiondata_args(this.__wbg_ptr);
        return takeObject(ret);
    }
}

const TransactionHashFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_transactionhash_free(ptr >>> 0, 1));

export class TransactionHash {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(TransactionHash.prototype);
        obj.__wbg_ptr = ptr;
        TransactionHashFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        TransactionHashFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_transactionhash_free(ptr, 0);
    }
    /**
     * @param {string} transaction_hash_hex_str
     */
    constructor(transaction_hash_hex_str) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(transaction_hash_hex_str, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
            const len0 = WASM_VECTOR_LEN;
            wasm.transactionhash_new_js_alias(retptr, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            this.__wbg_ptr = r0 >>> 0;
            TransactionHashFinalization.register(this, this.__wbg_ptr, this);
            return this;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {TransactionHash}
     */
    static fromRaw(bytes) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_export_1);
            const len0 = WASM_VECTOR_LEN;
            wasm.transactionhash_fromRaw(retptr, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return TransactionHash.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {any}
     */
    toJson() {
        const ret = wasm.transactionhash_toJson(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @returns {string}
     */
    toString() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.transactionhash_toString(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_4(deferred1_0, deferred1_1, 1);
        }
    }
}

const TransactionResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_transactionresult_free(ptr >>> 0, 1));

export class TransactionResult {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(TransactionResult.prototype);
        obj.__wbg_ptr = ptr;
        TransactionResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        TransactionResultFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_transactionresult_free(ptr, 0);
    }
    /**
     * @returns {TransactionStatus | undefined}
     */
    get status() {
        const ret = wasm.__wbg_get_transactionresult_status(this.__wbg_ptr);
        return ret === 7 ? undefined : ret;
    }
    /**
     * @returns {boolean}
     */
    get isCancelled() {
        const ret = wasm.__wbg_get_transactionresult_isCancelled(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {string | undefined}
     */
    get deployHash() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_transactionresult_deployHash(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            let v1;
            if (r0 !== 0) {
                v1 = getStringFromWasm0(r0, r1).slice();
                wasm.__wbindgen_export_4(r0, r1 * 1, 1);
            }
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {string | undefined}
     */
    get error() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_transactionresult_error(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            let v1;
            if (r0 !== 0) {
                v1 = getStringFromWasm0(r0, r1).slice();
                wasm.__wbindgen_export_4(r0, r1 * 1, 1);
            }
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {number | undefined}
     */
    get errorCode() {
        const ret = wasm.__wbg_get_transactionresult_errorCode(this.__wbg_ptr);
        return ret === 0xFFFFFF ? undefined : ret;
    }
    /**
     * @returns {string | undefined}
     */
    get errorData() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_transactionresult_errorData(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            let v1;
            if (r0 !== 0) {
                v1 = getStringFromWasm0(r0, r1).slice();
                wasm.__wbindgen_export_4(r0, r1 * 1, 1);
            }
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {string | undefined}
     */
    get transactionHash() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_transactionresult_transactionHash(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            let v1;
            if (r0 !== 0) {
                v1 = getStringFromWasm0(r0, r1).slice();
                wasm.__wbindgen_export_4(r0, r1 * 1, 1);
            }
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {TransactionData | undefined}
     */
    get data() {
        const ret = wasm.__wbg_get_transactionresult_data(this.__wbg_ptr);
        return ret === 0 ? undefined : TransactionData.__wrap(ret);
    }
}

const TransferFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_transfer_free(ptr >>> 0, 1));

export class Transfer {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        TransferFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_transfer_free(ptr, 0);
    }
    /**
     * @param {Address} sender
     * @param {Address} recipient
     * @param {U256} amount
     */
    constructor(sender, recipient, amount) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(sender, Address);
            var ptr0 = sender.__destroy_into_raw();
            _assertClass(recipient, Address);
            var ptr1 = recipient.__destroy_into_raw();
            _assertClass(amount, U256);
            var ptr2 = amount.__destroy_into_raw();
            wasm.setallowance_new(retptr, ptr0, ptr1, ptr2);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            this.__wbg_ptr = r0 >>> 0;
            TransferFinalization.register(this, this.__wbg_ptr, this);
            return this;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {any}
     */
    toJson() {
        const ret = wasm.transfer_toJson(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @param {Address} value
     */
    set sender(value) {
        _assertClass(value, Address);
        var ptr0 = value.__destroy_into_raw();
        wasm.transfer_set_sender(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {Address}
     */
    get sender() {
        const ret = wasm.setallowance_owner(this.__wbg_ptr);
        return Address.__wrap(ret);
    }
    /**
     * @param {Address} value
     */
    set recipient(value) {
        _assertClass(value, Address);
        var ptr0 = value.__destroy_into_raw();
        wasm.transfer_set_recipient(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {Address}
     */
    get recipient() {
        const ret = wasm.setallowance_spender(this.__wbg_ptr);
        return Address.__wrap(ret);
    }
    /**
     * @param {U256} value
     */
    set amount(value) {
        _assertClass(value, U256);
        var ptr0 = value.__destroy_into_raw();
        wasm.transfer_set_amount(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {U256}
     */
    get amount() {
        const ret = wasm.setallowance_allowance(this.__wbg_ptr);
        return U256.__wrap(ret);
    }
}

const TransferFromFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_transferfrom_free(ptr >>> 0, 1));

export class TransferFrom {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        TransferFromFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_transferfrom_free(ptr, 0);
    }
    /**
     * @param {Address} spender
     * @param {Address} owner
     * @param {Address} recipient
     * @param {U256} amount
     */
    constructor(spender, owner, recipient, amount) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(spender, Address);
            var ptr0 = spender.__destroy_into_raw();
            _assertClass(owner, Address);
            var ptr1 = owner.__destroy_into_raw();
            _assertClass(recipient, Address);
            var ptr2 = recipient.__destroy_into_raw();
            _assertClass(amount, U256);
            var ptr3 = amount.__destroy_into_raw();
            wasm.transferfrom_new(retptr, ptr0, ptr1, ptr2, ptr3);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            this.__wbg_ptr = r0 >>> 0;
            TransferFromFinalization.register(this, this.__wbg_ptr, this);
            return this;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {any}
     */
    toJson() {
        const ret = wasm.transferfrom_toJson(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @param {Address} value
     */
    set spender(value) {
        _assertClass(value, Address);
        var ptr0 = value.__destroy_into_raw();
        wasm.transferfrom_set_spender(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {Address}
     */
    get spender() {
        const ret = wasm.transferfrom_spender(this.__wbg_ptr);
        return Address.__wrap(ret);
    }
    /**
     * @param {Address} value
     */
    set owner(value) {
        _assertClass(value, Address);
        var ptr0 = value.__destroy_into_raw();
        wasm.transferfrom_set_owner(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {Address}
     */
    get owner() {
        const ret = wasm.transferfrom_owner(this.__wbg_ptr);
        return Address.__wrap(ret);
    }
    /**
     * @param {Address} value
     */
    set recipient(value) {
        _assertClass(value, Address);
        var ptr0 = value.__destroy_into_raw();
        wasm.transferfrom_set_recipient(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {Address}
     */
    get recipient() {
        const ret = wasm.transferfrom_recipient(this.__wbg_ptr);
        return Address.__wrap(ret);
    }
    /**
     * @param {U256} value
     */
    set amount(value) {
        _assertClass(value, U256);
        var ptr0 = value.__destroy_into_raw();
        wasm.transferfrom_set_amount(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {U256}
     */
    get amount() {
        const ret = wasm.decreaseallowance_allowance(this.__wbg_ptr);
        return U256.__wrap(ret);
    }
}

const U128Finalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_u128_free(ptr >>> 0, 1));

export class U128 {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(U128.prototype);
        obj.__wbg_ptr = ptr;
        U128Finalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        U128Finalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_u128_free(ptr, 0);
    }
    /**
     * @param {string} value
     */
    constructor(value) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(value, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
            const len0 = WASM_VECTOR_LEN;
            wasm.u128_from_dec_str(retptr, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            this.__wbg_ptr = r0 >>> 0;
            U128Finalization.register(this, this.__wbg_ptr, this);
            return this;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {number} value
     * @returns {U128}
     */
    static fromNumber(value) {
        const ret = wasm.u128_fromNumber(value);
        return U128.__wrap(ret);
    }
    /**
     * @param {HTMLInputElement} input
     * @returns {U128}
     */
    static fromHtmlInput(input) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.u128_fromHtmlInput(retptr, addHeapObject(input));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return U128.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {bigint} value
     * @returns {U128}
     */
    static fromBigInt(value) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.u128_fromBigInt(retptr, addBorrowedObject(value));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return U128.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            heap[stack_pointer++] = undefined;
        }
    }
    /**
     * @returns {string}
     */
    toString() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.u128_toString(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_4(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {any}
     */
    toJson() {
        const ret = wasm.u128_toJson(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @param {number} decimals
     * @returns {BalanceFormatter}
     */
    formatter(decimals) {
        const ret = wasm.u128_formatter(this.__wbg_ptr, decimals);
        return BalanceFormatter.__wrap(ret);
    }
    /**
     * @param {U128} other
     * @returns {U128}
     */
    mul(other) {
        _assertClass(other, U128);
        const ret = wasm.u128_mul(this.__wbg_ptr, other.__wbg_ptr);
        return U128.__wrap(ret);
    }
    /**
     * @param {bigint} other
     * @returns {U128}
     */
    mulBigInt(other) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.u128_mulBigInt(retptr, this.__wbg_ptr, addBorrowedObject(other));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return U128.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            heap[stack_pointer++] = undefined;
        }
    }
    /**
     * @param {U128} other
     * @returns {U128}
     */
    div(other) {
        _assertClass(other, U128);
        const ret = wasm.u128_div(this.__wbg_ptr, other.__wbg_ptr);
        return U128.__wrap(ret);
    }
    /**
     * @param {bigint} other
     * @returns {U128}
     */
    divBigInt(other) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.u128_divBigInt(retptr, this.__wbg_ptr, addBorrowedObject(other));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return U128.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            heap[stack_pointer++] = undefined;
        }
    }
    /**
     * @param {U128} other
     * @returns {U128}
     */
    add(other) {
        _assertClass(other, U128);
        const ret = wasm.u128_add(this.__wbg_ptr, other.__wbg_ptr);
        return U128.__wrap(ret);
    }
    /**
     * @param {bigint} other
     * @returns {U128}
     */
    addBigInt(other) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.u128_addBigInt(retptr, this.__wbg_ptr, addBorrowedObject(other));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return U128.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            heap[stack_pointer++] = undefined;
        }
    }
    /**
     * @param {U128} other
     * @returns {U128}
     */
    sub(other) {
        _assertClass(other, U128);
        const ret = wasm.u128_sub(this.__wbg_ptr, other.__wbg_ptr);
        return U128.__wrap(ret);
    }
    /**
     * @param {bigint} other
     * @returns {U128}
     */
    subBigInt(other) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.u128_subBigInt(retptr, this.__wbg_ptr, addBorrowedObject(other));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return U128.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            heap[stack_pointer++] = undefined;
        }
    }
    /**
     * @param {U128} other
     * @returns {U128 | undefined}
     */
    checkedMul(other) {
        _assertClass(other, U128);
        const ret = wasm.u128_checkedMul(this.__wbg_ptr, other.__wbg_ptr);
        return ret === 0 ? undefined : U128.__wrap(ret);
    }
    /**
     * @param {U128} other
     * @returns {U128 | undefined}
     */
    checkedAdd(other) {
        _assertClass(other, U128);
        const ret = wasm.u128_checkedAdd(this.__wbg_ptr, other.__wbg_ptr);
        return ret === 0 ? undefined : U128.__wrap(ret);
    }
    /**
     * @param {U128} other
     * @returns {U128 | undefined}
     */
    checkedSub(other) {
        _assertClass(other, U128);
        const ret = wasm.u128_checkedSub(this.__wbg_ptr, other.__wbg_ptr);
        return ret === 0 ? undefined : U128.__wrap(ret);
    }
    /**
     * @param {U128} other
     * @returns {U128 | undefined}
     */
    checkedDiv(other) {
        _assertClass(other, U128);
        const ret = wasm.u128_checkedDiv(this.__wbg_ptr, other.__wbg_ptr);
        return ret === 0 ? undefined : U128.__wrap(ret);
    }
    /**
     * @param {U128} other
     * @returns {U128 | undefined}
     */
    checkedRem(other) {
        _assertClass(other, U128);
        const ret = wasm.u128_checkedRem(this.__wbg_ptr, other.__wbg_ptr);
        return ret === 0 ? undefined : U128.__wrap(ret);
    }
    /**
     * @param {number} exp
     * @returns {U128 | undefined}
     */
    checkedPow(exp) {
        const ret = wasm.u128_checkedPow(this.__wbg_ptr, exp);
        return ret === 0 ? undefined : U128.__wrap(ret);
    }
    /**
     * @returns {bigint}
     */
    toBigInt() {
        const ret = wasm.u128_toBigInt(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @param {U128} other
     * @returns {boolean}
     */
    lt(other) {
        _assertClass(other, U128);
        const ret = wasm.u128_lt(this.__wbg_ptr, other.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {U128} other
     * @returns {boolean}
     */
    le(other) {
        _assertClass(other, U128);
        const ret = wasm.u128_le(this.__wbg_ptr, other.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {U128} other
     * @returns {boolean}
     */
    gt(other) {
        _assertClass(other, U128);
        const ret = wasm.u128_gt(this.__wbg_ptr, other.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {U128} other
     * @returns {boolean}
     */
    ge(other) {
        _assertClass(other, U128);
        const ret = wasm.u128_ge(this.__wbg_ptr, other.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {U128} other
     * @returns {OverflowingResultU128}
     */
    overflowingMul(other) {
        _assertClass(other, U128);
        const ret = wasm.u128_overflowingMul(this.__wbg_ptr, other.__wbg_ptr);
        return OverflowingResultU128.__wrap(ret);
    }
    /**
     * @param {U128} other
     * @returns {OverflowingResultU128}
     */
    overflowingAdd(other) {
        _assertClass(other, U128);
        const ret = wasm.u128_overflowingAdd(this.__wbg_ptr, other.__wbg_ptr);
        return OverflowingResultU128.__wrap(ret);
    }
    /**
     * @param {U128} other
     * @returns {OverflowingResultU128}
     */
    overflowingSub(other) {
        _assertClass(other, U128);
        const ret = wasm.u128_overflowingSub(this.__wbg_ptr, other.__wbg_ptr);
        return OverflowingResultU128.__wrap(ret);
    }
    /**
     * @param {number} exp
     * @returns {OverflowingResultU128}
     */
    overflowingPow(exp) {
        const ret = wasm.u128_overflowingPow(this.__wbg_ptr, exp);
        return OverflowingResultU128.__wrap(ret);
    }
    /**
     * @param {U512} value
     * @returns {U128}
     */
    static fromU512(value) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(value, U512);
            var ptr0 = value.__destroy_into_raw();
            wasm.u128_fromU512(retptr, ptr0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return U128.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {U512}
     */
    toU512() {
        const ret = wasm.u128_toU512(this.__wbg_ptr);
        return U512.__wrap(ret);
    }
    /**
     * @param {U256} value
     * @returns {U128}
     */
    static fromU256(value) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(value, U256);
            var ptr0 = value.__destroy_into_raw();
            wasm.u128_fromU256(retptr, ptr0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return U128.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {U256}
     */
    toU256() {
        const ret = wasm.u128_toU256(this.__wbg_ptr);
        return U256.__wrap(ret);
    }
}

const U256Finalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_u256_free(ptr >>> 0, 1));

export class U256 {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(U256.prototype);
        obj.__wbg_ptr = ptr;
        U256Finalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        U256Finalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_u256_free(ptr, 0);
    }
    /**
     * @param {string} value
     */
    constructor(value) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(value, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
            const len0 = WASM_VECTOR_LEN;
            wasm.u256_from_dec_str(retptr, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            this.__wbg_ptr = r0 >>> 0;
            U256Finalization.register(this, this.__wbg_ptr, this);
            return this;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {number} value
     * @returns {U256}
     */
    static fromNumber(value) {
        const ret = wasm.u256_fromNumber(value);
        return U256.__wrap(ret);
    }
    /**
     * @param {HTMLInputElement} input
     * @returns {U256}
     */
    static fromHtmlInput(input) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.u256_fromHtmlInput(retptr, addHeapObject(input));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return U256.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {bigint} value
     * @returns {U256}
     */
    static fromBigInt(value) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.u256_fromBigInt(retptr, addBorrowedObject(value));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return U256.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            heap[stack_pointer++] = undefined;
        }
    }
    /**
     * @returns {string}
     */
    toString() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.u256_toString(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_4(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {any}
     */
    toJson() {
        const ret = wasm.u256_toJson(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @param {number} decimals
     * @returns {BalanceFormatter}
     */
    formatter(decimals) {
        const ret = wasm.u256_formatter(this.__wbg_ptr, decimals);
        return BalanceFormatter.__wrap(ret);
    }
    /**
     * @param {U256} other
     * @returns {U256}
     */
    mul(other) {
        _assertClass(other, U256);
        const ret = wasm.u256_mul(this.__wbg_ptr, other.__wbg_ptr);
        return U256.__wrap(ret);
    }
    /**
     * @param {bigint} other
     * @returns {U256}
     */
    mulBigInt(other) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.u256_mulBigInt(retptr, this.__wbg_ptr, addBorrowedObject(other));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return U256.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            heap[stack_pointer++] = undefined;
        }
    }
    /**
     * @param {U256} other
     * @returns {U256}
     */
    div(other) {
        _assertClass(other, U256);
        const ret = wasm.u256_div(this.__wbg_ptr, other.__wbg_ptr);
        return U256.__wrap(ret);
    }
    /**
     * @param {bigint} other
     * @returns {U256}
     */
    divBigInt(other) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.u256_divBigInt(retptr, this.__wbg_ptr, addBorrowedObject(other));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return U256.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            heap[stack_pointer++] = undefined;
        }
    }
    /**
     * @param {U256} other
     * @returns {U256}
     */
    add(other) {
        _assertClass(other, U256);
        const ret = wasm.u256_add(this.__wbg_ptr, other.__wbg_ptr);
        return U256.__wrap(ret);
    }
    /**
     * @param {bigint} other
     * @returns {U256}
     */
    addBigInt(other) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.u256_addBigInt(retptr, this.__wbg_ptr, addBorrowedObject(other));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return U256.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            heap[stack_pointer++] = undefined;
        }
    }
    /**
     * @param {U256} other
     * @returns {U256}
     */
    sub(other) {
        _assertClass(other, U256);
        const ret = wasm.u256_sub(this.__wbg_ptr, other.__wbg_ptr);
        return U256.__wrap(ret);
    }
    /**
     * @param {bigint} other
     * @returns {U256}
     */
    subBigInt(other) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.u256_subBigInt(retptr, this.__wbg_ptr, addBorrowedObject(other));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return U256.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            heap[stack_pointer++] = undefined;
        }
    }
    /**
     * @param {U256} other
     * @returns {U256 | undefined}
     */
    checkedMul(other) {
        _assertClass(other, U256);
        const ret = wasm.u256_checkedMul(this.__wbg_ptr, other.__wbg_ptr);
        return ret === 0 ? undefined : U256.__wrap(ret);
    }
    /**
     * @param {U256} other
     * @returns {U256 | undefined}
     */
    checkedAdd(other) {
        _assertClass(other, U256);
        const ret = wasm.u256_checkedAdd(this.__wbg_ptr, other.__wbg_ptr);
        return ret === 0 ? undefined : U256.__wrap(ret);
    }
    /**
     * @param {U256} other
     * @returns {U256 | undefined}
     */
    checkedSub(other) {
        _assertClass(other, U256);
        const ret = wasm.u256_checkedSub(this.__wbg_ptr, other.__wbg_ptr);
        return ret === 0 ? undefined : U256.__wrap(ret);
    }
    /**
     * @param {U256} other
     * @returns {U256 | undefined}
     */
    checkedDiv(other) {
        _assertClass(other, U256);
        const ret = wasm.u256_checkedDiv(this.__wbg_ptr, other.__wbg_ptr);
        return ret === 0 ? undefined : U256.__wrap(ret);
    }
    /**
     * @param {U256} other
     * @returns {U256 | undefined}
     */
    checkedRem(other) {
        _assertClass(other, U256);
        const ret = wasm.u256_checkedRem(this.__wbg_ptr, other.__wbg_ptr);
        return ret === 0 ? undefined : U256.__wrap(ret);
    }
    /**
     * @param {number} exp
     * @returns {U256 | undefined}
     */
    checkedPow(exp) {
        const ret = wasm.u256_checkedPow(this.__wbg_ptr, exp);
        return ret === 0 ? undefined : U256.__wrap(ret);
    }
    /**
     * @returns {bigint}
     */
    toBigInt() {
        const ret = wasm.u256_toBigInt(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @param {U256} other
     * @returns {boolean}
     */
    lt(other) {
        _assertClass(other, U256);
        const ret = wasm.u256_lt(this.__wbg_ptr, other.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {U256} other
     * @returns {boolean}
     */
    le(other) {
        _assertClass(other, U256);
        const ret = wasm.u256_le(this.__wbg_ptr, other.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {U256} other
     * @returns {boolean}
     */
    gt(other) {
        _assertClass(other, U256);
        const ret = wasm.u256_gt(this.__wbg_ptr, other.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {U256} other
     * @returns {boolean}
     */
    ge(other) {
        _assertClass(other, U256);
        const ret = wasm.u256_ge(this.__wbg_ptr, other.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {U256} other
     * @returns {OverflowingResultU256}
     */
    overflowingMul(other) {
        _assertClass(other, U256);
        const ret = wasm.u256_overflowingMul(this.__wbg_ptr, other.__wbg_ptr);
        return OverflowingResultU256.__wrap(ret);
    }
    /**
     * @param {U256} other
     * @returns {OverflowingResultU256}
     */
    overflowingAdd(other) {
        _assertClass(other, U256);
        const ret = wasm.u256_overflowingAdd(this.__wbg_ptr, other.__wbg_ptr);
        return OverflowingResultU256.__wrap(ret);
    }
    /**
     * @param {U256} other
     * @returns {OverflowingResultU256}
     */
    overflowingSub(other) {
        _assertClass(other, U256);
        const ret = wasm.u256_overflowingSub(this.__wbg_ptr, other.__wbg_ptr);
        return OverflowingResultU256.__wrap(ret);
    }
    /**
     * @param {number} exp
     * @returns {OverflowingResultU256}
     */
    overflowingPow(exp) {
        const ret = wasm.u256_overflowingPow(this.__wbg_ptr, exp);
        return OverflowingResultU256.__wrap(ret);
    }
    /**
     * @param {U512} value
     * @returns {U256}
     */
    static fromU512(value) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(value, U512);
            var ptr0 = value.__destroy_into_raw();
            wasm.u256_fromU512(retptr, ptr0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return U256.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {U512}
     */
    toU512() {
        const ret = wasm.u256_toU512(this.__wbg_ptr);
        return U512.__wrap(ret);
    }
}

const U512Finalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_u512_free(ptr >>> 0, 1));

export class U512 {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(U512.prototype);
        obj.__wbg_ptr = ptr;
        U512Finalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        U512Finalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_u512_free(ptr, 0);
    }
    /**
     * @param {string} value
     */
    constructor(value) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(value, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
            const len0 = WASM_VECTOR_LEN;
            wasm.u512_from_dec_str(retptr, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            this.__wbg_ptr = r0 >>> 0;
            U512Finalization.register(this, this.__wbg_ptr, this);
            return this;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {number} value
     * @returns {U512}
     */
    static fromNumber(value) {
        const ret = wasm.u512_fromNumber(value);
        return U512.__wrap(ret);
    }
    /**
     * @param {HTMLInputElement} input
     * @returns {U512}
     */
    static fromHtmlInput(input) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.u512_fromHtmlInput(retptr, addHeapObject(input));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return U512.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {bigint} value
     * @returns {U512}
     */
    static fromBigInt(value) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.u512_fromBigInt(retptr, addBorrowedObject(value));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return U512.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            heap[stack_pointer++] = undefined;
        }
    }
    /**
     * @returns {string}
     */
    toString() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.u512_toString(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_4(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {any}
     */
    toJson() {
        const ret = wasm.u512_toJson(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @param {number} decimals
     * @returns {BalanceFormatter}
     */
    formatter(decimals) {
        const ret = wasm.u512_formatter(this.__wbg_ptr, decimals);
        return BalanceFormatter.__wrap(ret);
    }
    /**
     * @param {U512} other
     * @returns {U512}
     */
    mul(other) {
        _assertClass(other, U512);
        const ret = wasm.u512_mul(this.__wbg_ptr, other.__wbg_ptr);
        return U512.__wrap(ret);
    }
    /**
     * @param {bigint} other
     * @returns {U512}
     */
    mulBigInt(other) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.u512_mulBigInt(retptr, this.__wbg_ptr, addBorrowedObject(other));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return U512.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            heap[stack_pointer++] = undefined;
        }
    }
    /**
     * @param {U512} other
     * @returns {U512}
     */
    div(other) {
        _assertClass(other, U512);
        const ret = wasm.u512_div(this.__wbg_ptr, other.__wbg_ptr);
        return U512.__wrap(ret);
    }
    /**
     * @param {bigint} other
     * @returns {U512}
     */
    divBigInt(other) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.u512_divBigInt(retptr, this.__wbg_ptr, addBorrowedObject(other));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return U512.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            heap[stack_pointer++] = undefined;
        }
    }
    /**
     * @param {U512} other
     * @returns {U512}
     */
    add(other) {
        _assertClass(other, U512);
        const ret = wasm.u512_add(this.__wbg_ptr, other.__wbg_ptr);
        return U512.__wrap(ret);
    }
    /**
     * @param {bigint} other
     * @returns {U512}
     */
    addBigInt(other) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.u512_addBigInt(retptr, this.__wbg_ptr, addBorrowedObject(other));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return U512.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            heap[stack_pointer++] = undefined;
        }
    }
    /**
     * @param {U512} other
     * @returns {U512}
     */
    sub(other) {
        _assertClass(other, U512);
        const ret = wasm.u512_sub(this.__wbg_ptr, other.__wbg_ptr);
        return U512.__wrap(ret);
    }
    /**
     * @param {bigint} other
     * @returns {U512}
     */
    subBigInt(other) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.u512_subBigInt(retptr, this.__wbg_ptr, addBorrowedObject(other));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return U512.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            heap[stack_pointer++] = undefined;
        }
    }
    /**
     * @param {U512} other
     * @returns {U512 | undefined}
     */
    checkedMul(other) {
        _assertClass(other, U512);
        const ret = wasm.u512_checkedMul(this.__wbg_ptr, other.__wbg_ptr);
        return ret === 0 ? undefined : U512.__wrap(ret);
    }
    /**
     * @param {U512} other
     * @returns {U512 | undefined}
     */
    checkedAdd(other) {
        _assertClass(other, U512);
        const ret = wasm.u512_checkedAdd(this.__wbg_ptr, other.__wbg_ptr);
        return ret === 0 ? undefined : U512.__wrap(ret);
    }
    /**
     * @param {U512} other
     * @returns {U512 | undefined}
     */
    checkedSub(other) {
        _assertClass(other, U512);
        const ret = wasm.u512_checkedSub(this.__wbg_ptr, other.__wbg_ptr);
        return ret === 0 ? undefined : U512.__wrap(ret);
    }
    /**
     * @param {U512} other
     * @returns {U512 | undefined}
     */
    checkedDiv(other) {
        _assertClass(other, U512);
        const ret = wasm.u512_checkedDiv(this.__wbg_ptr, other.__wbg_ptr);
        return ret === 0 ? undefined : U512.__wrap(ret);
    }
    /**
     * @param {U512} other
     * @returns {U512 | undefined}
     */
    checkedRem(other) {
        _assertClass(other, U512);
        const ret = wasm.u512_checkedRem(this.__wbg_ptr, other.__wbg_ptr);
        return ret === 0 ? undefined : U512.__wrap(ret);
    }
    /**
     * @param {number} exp
     * @returns {U512 | undefined}
     */
    checkedPow(exp) {
        const ret = wasm.u512_checkedPow(this.__wbg_ptr, exp);
        return ret === 0 ? undefined : U512.__wrap(ret);
    }
    /**
     * @returns {bigint}
     */
    toBigInt() {
        const ret = wasm.u512_toBigInt(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @param {U512} other
     * @returns {boolean}
     */
    lt(other) {
        _assertClass(other, U512);
        const ret = wasm.u512_lt(this.__wbg_ptr, other.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {U512} other
     * @returns {boolean}
     */
    le(other) {
        _assertClass(other, U512);
        const ret = wasm.u512_le(this.__wbg_ptr, other.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {U512} other
     * @returns {boolean}
     */
    gt(other) {
        _assertClass(other, U512);
        const ret = wasm.u512_gt(this.__wbg_ptr, other.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {U512} other
     * @returns {boolean}
     */
    ge(other) {
        _assertClass(other, U512);
        const ret = wasm.u512_ge(this.__wbg_ptr, other.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {U512} other
     * @returns {OverflowingResultU512}
     */
    overflowingMul(other) {
        _assertClass(other, U512);
        const ret = wasm.u512_overflowingMul(this.__wbg_ptr, other.__wbg_ptr);
        return OverflowingResultU512.__wrap(ret);
    }
    /**
     * @param {U512} other
     * @returns {OverflowingResultU512}
     */
    overflowingAdd(other) {
        _assertClass(other, U512);
        const ret = wasm.u512_overflowingAdd(this.__wbg_ptr, other.__wbg_ptr);
        return OverflowingResultU512.__wrap(ret);
    }
    /**
     * @param {U512} other
     * @returns {OverflowingResultU512}
     */
    overflowingSub(other) {
        _assertClass(other, U512);
        const ret = wasm.u512_overflowingSub(this.__wbg_ptr, other.__wbg_ptr);
        return OverflowingResultU512.__wrap(ret);
    }
    /**
     * @param {number} exp
     * @returns {OverflowingResultU512}
     */
    overflowingPow(exp) {
        const ret = wasm.u512_overflowingPow(this.__wbg_ptr, exp);
        return OverflowingResultU512.__wrap(ret);
    }
}

const URefFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_uref_free(ptr >>> 0, 1));

export class URef {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(URef.prototype);
        obj.__wbg_ptr = ptr;
        URefFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        URefFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_uref_free(ptr, 0);
    }
    /**
     * @param {string} uref_hex_str
     * @param {number} access_rights
     */
    constructor(uref_hex_str, access_rights) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(uref_hex_str, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
            const len0 = WASM_VECTOR_LEN;
            wasm.uref_new_js_alias(retptr, ptr0, len0, access_rights);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            this.__wbg_ptr = r0 >>> 0;
            URefFinalization.register(this, this.__wbg_ptr, this);
            return this;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {string} formatted_str
     * @returns {URef}
     */
    static fromFormattedStr(formatted_str) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(formatted_str, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
            const len0 = WASM_VECTOR_LEN;
            wasm.uref_fromFormattedStr(retptr, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return URef.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} bytes
     * @param {number} access_rights
     * @returns {URef}
     */
    static fromUint8Array(bytes, access_rights) {
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.uref_fromUint8Array(ptr0, len0, access_rights);
        return URef.__wrap(ret);
    }
    /**
     * @returns {string}
     */
    toFormattedString() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.uref_toFormattedString(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_4(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {any}
     */
    toJson() {
        const ret = wasm.uref_toJson(this.__wbg_ptr);
        return takeObject(ret);
    }
}

const UnpausedFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_unpaused_free(ptr >>> 0, 1));

export class Unpaused {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        UnpausedFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_unpaused_free(ptr, 0);
    }
    /**
     * @param {Address} account
     */
    constructor(account) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(account, Address);
            var ptr0 = account.__destroy_into_raw();
            wasm.paused_new(retptr, ptr0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            this.__wbg_ptr = r0 >>> 0;
            UnpausedFinalization.register(this, this.__wbg_ptr, this);
            return this;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {any}
     */
    toJson() {
        const ret = wasm.paused_toJson(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @param {Address} value
     */
    set account(value) {
        _assertClass(value, Address);
        var ptr0 = value.__destroy_into_raw();
        wasm.unpaused_set_account(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {Address}
     */
    get account() {
        const ret = wasm.paused_account(this.__wbg_ptr);
        return Address.__wrap(ret);
    }
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbg_abort_410ec47a64ac6117 = function(arg0, arg1) {
        getObject(arg0).abort(getObject(arg1));
    };
    imports.wbg.__wbg_abort_775ef1d17fc65868 = function(arg0) {
        getObject(arg0).abort();
    };
    imports.wbg.__wbg_accountinfo_new = function(arg0) {
        const ret = AccountInfo.__wrap(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_addEventListener_90e553fdce254421 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        getObject(arg0).addEventListener(getStringFromWasm0(arg1, arg2), getObject(arg3));
    }, arguments) };
    imports.wbg.__wbg_address_new = function(arg0) {
        const ret = Address.__wrap(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_addressmarketstate_new = function(arg0) {
        const ret = AddressMarketState.__wrap(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_append_8c7dd8d641a5f01b = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        getObject(arg0).append(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
    }, arguments) };
    imports.wbg.__wbg_arrayBuffer_d1b44c4390db422f = function() { return handleError(function (arg0) {
        const ret = getObject(arg0).arrayBuffer();
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_buffer_609cc3eee51ed158 = function(arg0) {
        const ret = getObject(arg0).buffer;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_call_672a4d21634d4a24 = function() { return handleError(function (arg0, arg1) {
        const ret = getObject(arg0).call(getObject(arg1));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_call_7cccdd69e0791ae2 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = getObject(arg0).call(getObject(arg1), getObject(arg2));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_call_833bed5770ea2041 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        const ret = getObject(arg0).call(getObject(arg1), getObject(arg2), getObject(arg3));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_clearTimeout_6222fede17abcb1a = function(arg0) {
        const ret = clearTimeout(takeObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_config_new = function(arg0) {
        const ret = Config.__wrap(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_connect_d9c38cc4ead6c3e2 = function() { return handleError(function (arg0, arg1) {
        const ret = window.csprclick.connect(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_disconnect_bca5c1a73d4387ad = function() { return handleError(function () {
        const ret = window.csprclick.disconnect();
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_done_769e5ede4b31c67b = function(arg0) {
        const ret = getObject(arg0).done;
        return ret;
    };
    imports.wbg.__wbg_fetch_509096533071c657 = function(arg0, arg1) {
        const ret = getObject(arg0).fetch(getObject(arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_fetch_f156d10be9a5c88a = function(arg0) {
        const ret = fetch(getObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_getActiveAccountAsync_b35b03986928dcc0 = function() { return handleError(function (arg0) {
        const ret = window.csprclick.getActiveAccountAsync(getObject(arg0));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_getActivePublicKey_8f98b3a151f996dd = function() { return handleError(function () {
        const ret = window.csprclick.getActivePublicKey();
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_get_67b2ba62fc30de12 = function() { return handleError(function (arg0, arg1) {
        const ret = Reflect.get(getObject(arg0), getObject(arg1));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_getindex_5b00c274b05714aa = function(arg0, arg1) {
        const ret = getObject(arg0)[arg1 >>> 0];
        return ret;
    };
    imports.wbg.__wbg_has_a5ea9117f258a0ec = function() { return handleError(function (arg0, arg1) {
        const ret = Reflect.has(getObject(arg0), getObject(arg1));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_headers_9cb51cfd2ac780a4 = function(arg0) {
        const ret = getObject(arg0).headers;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_instanceof_Response_f2cc20d9f7dfd644 = function(arg0) {
        let result;
        try {
            result = getObject(arg0) instanceof Response;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_Window_def73ea0955fc569 = function(arg0) {
        let result;
        try {
            result = getObject(arg0) instanceof Window;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_isUnlocked_86d5cdaf929fabd1 = function() { return handleError(function (arg0, arg1) {
        const ret = window.csprclick.isUnlocked(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_iterator_9a24c88df860dc65 = function() {
        const ret = Symbol.iterator;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_length_a446193dc22c12f8 = function(arg0) {
        const ret = getObject(arg0).length;
        return ret;
    };
    imports.wbg.__wbg_log_f261eb0cbda5aad7 = function(arg0, arg1) {
        console.log(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbg_marketstate_new = function(arg0) {
        const ret = MarketState.__wrap(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_new0_f788a2397c7ca929 = function() {
        const ret = new Date();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_new_018dcc2d6c8c2f6a = function() { return handleError(function () {
        const ret = new Headers();
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_new_23a2665fac83c611 = function(arg0, arg1) {
        try {
            var state0 = {a: arg0, b: arg1};
            var cb0 = (arg0, arg1) => {
                const a = state0.a;
                state0.a = 0;
                try {
                    return __wbg_adapter_671(a, state0.b, arg0, arg1);
                } finally {
                    state0.a = a;
                }
            };
            const ret = new Promise(cb0);
            return addHeapObject(ret);
        } finally {
            state0.a = state0.b = 0;
        }
    };
    imports.wbg.__wbg_new_405e22f390576ce2 = function() {
        const ret = new Object();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_new_a12002a7f91c75be = function(arg0) {
        const ret = new Uint8Array(getObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_new_e25e5aab09ff45db = function() { return handleError(function () {
        const ret = new AbortController();
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_newnoargs_105ed471475aaf50 = function(arg0, arg1) {
        const ret = new Function(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_newwithbyteoffsetandlength_d97e637ebe145a9a = function(arg0, arg1, arg2) {
        const ret = new Uint8Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_newwithstrandinit_06c535e0a867c635 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = new Request(getStringFromWasm0(arg0, arg1), getObject(arg2));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_next_25feadfc0913fea9 = function(arg0) {
        const ret = getObject(arg0).next;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_next_6574e1a8a62d1055 = function() { return handleError(function (arg0) {
        const ret = getObject(arg0).next();
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_on_ae1106a79ddac2b7 = function() { return handleError(function (arg0, arg1, arg2) {
        window.csprclick.on(getStringFromWasm0(arg0, arg1), getObject(arg2));
    }, arguments) };
    imports.wbg.__wbg_parse_def2e24ef1252aff = function() { return handleError(function (arg0, arg1) {
        const ret = JSON.parse(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_queueMicrotask_97d92b4fcc8a61c5 = function(arg0) {
        queueMicrotask(getObject(arg0));
    };
    imports.wbg.__wbg_queueMicrotask_d3219def82552485 = function(arg0) {
        const ret = getObject(arg0).queueMicrotask;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_resolve_4851785c9c5f573d = function(arg0) {
        const ret = Promise.resolve(getObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_send_e647589a2882cc5b = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        const ret = window.csprclick.send(getStringFromWasm0(arg0, arg1), getStringFromWasm0(arg2, arg3), getObject(arg4));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_setTimeout_2b339866a2aa3789 = function(arg0, arg1) {
        const ret = setTimeout(getObject(arg0), arg1);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_set_65595bdd868b3009 = function(arg0, arg1, arg2) {
        getObject(arg0).set(getObject(arg1), arg2 >>> 0);
    };
    imports.wbg.__wbg_setbody_5923b78a95eedf29 = function(arg0, arg1) {
        getObject(arg0).body = getObject(arg1);
    };
    imports.wbg.__wbg_setcache_12f17c3a980650e4 = function(arg0, arg1) {
        getObject(arg0).cache = __wbindgen_enum_RequestCache[arg1];
    };
    imports.wbg.__wbg_setcredentials_c3a22f1cd105a2c6 = function(arg0, arg1) {
        getObject(arg0).credentials = __wbindgen_enum_RequestCredentials[arg1];
    };
    imports.wbg.__wbg_setheaders_834c0bdb6a8949ad = function(arg0, arg1) {
        getObject(arg0).headers = getObject(arg1);
    };
    imports.wbg.__wbg_setmethod_3c5280fe5d890842 = function(arg0, arg1, arg2) {
        getObject(arg0).method = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_setmode_5dc300b865044b65 = function(arg0, arg1) {
        getObject(arg0).mode = __wbindgen_enum_RequestMode[arg1];
    };
    imports.wbg.__wbg_setsignal_75b21ef3a81de905 = function(arg0, arg1) {
        getObject(arg0).signal = getObject(arg1);
    };
    imports.wbg.__wbg_signInWithAccount_094e66a7044f455a = function() { return handleError(function (arg0) {
        const ret = window.csprclick.signInWithAccount(AccountInfo.__wrap(arg0));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_signIn_f9cb9f44ef2c95e8 = function() { return handleError(function () {
        window.csprclick.signIn();
    }, arguments) };
    imports.wbg.__wbg_signMessage_739d977191336d27 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        const ret = window.csprclick.signMessage(getStringFromWasm0(arg0, arg1), getStringFromWasm0(arg2, arg3));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_signOut_906271f4fa2d061b = function() { return handleError(function () {
        window.csprclick.signOut();
    }, arguments) };
    imports.wbg.__wbg_sign_f6b7d53a2bafae37 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        const ret = window.csprclick.sign(getStringFromWasm0(arg0, arg1), getStringFromWasm0(arg2, arg3));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_signal_aaf9ad74119f20a4 = function(arg0) {
        const ret = getObject(arg0).signal;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_signresult_new = function(arg0) {
        const ret = SignResult.__wrap(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_static_accessor_GLOBAL_88a902d13a557d07 = function() {
        const ret = typeof global === 'undefined' ? null : global;
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_static_accessor_GLOBAL_THIS_56578be7e9f832b0 = function() {
        const ret = typeof globalThis === 'undefined' ? null : globalThis;
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_static_accessor_SELF_37c5d418e4bf5819 = function() {
        const ret = typeof self === 'undefined' ? null : self;
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_static_accessor_WINDOW_5de37043a91a9c40 = function() {
        const ret = typeof window === 'undefined' ? null : window;
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_status_f6360336ca686bf0 = function(arg0) {
        const ret = getObject(arg0).status;
        return ret;
    };
    imports.wbg.__wbg_stringify_f7ed6987935b4a24 = function() { return handleError(function (arg0) {
        const ret = JSON.stringify(getObject(arg0));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_switchAccount_4168ea954641d5fe = function() { return handleError(function () {
        const ret = window.csprclick.switchAccount();
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_then_44b73946d2fb3e7d = function(arg0, arg1) {
        const ret = getObject(arg0).then(getObject(arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_then_48b406749878a531 = function(arg0, arg1, arg2) {
        const ret = getObject(arg0).then(getObject(arg1), getObject(arg2));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_toISOString_b015155a5a6fe219 = function(arg0) {
        const ret = getObject(arg0).toISOString();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_toString_b5d4438bc26b267c = function() { return handleError(function (arg0, arg1) {
        const ret = getObject(arg0).toString(arg1);
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_transactionhash_new = function(arg0) {
        const ret = TransactionHash.__wrap(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_transactionresult_new = function(arg0) {
        const ret = TransactionResult.__wrap(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_u256_new = function(arg0) {
        const ret = U256.__wrap(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_u512_new = function(arg0) {
        const ret = U512.__wrap(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_url_ae10c34ca209681d = function(arg0, arg1) {
        const ret = getObject(arg1).url;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_value_91cbf0dd3ab84c1e = function(arg0, arg1) {
        const ret = getObject(arg1).value;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_value_cd1ffa7b1ab794f1 = function(arg0) {
        const ret = getObject(arg0).value;
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_array_new = function() {
        const ret = [];
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_array_push = function(arg0, arg1) {
        getObject(arg0).push(takeObject(arg1));
    };
    imports.wbg.__wbindgen_boolean_get = function(arg0) {
        const v = getObject(arg0);
        const ret = typeof(v) === 'boolean' ? (v ? 1 : 0) : 2;
        return ret;
    };
    imports.wbg.__wbindgen_cb_drop = function(arg0) {
        const obj = takeObject(arg0).original;
        if (obj.cnt-- == 1) {
            obj.a = 0;
            return true;
        }
        const ret = false;
        return ret;
    };
    imports.wbg.__wbindgen_closure_wrapper2537 = function(arg0, arg1, arg2) {
        const ret = makeClosure(arg0, arg1, 237, __wbg_adapter_41);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_closure_wrapper2539 = function(arg0, arg1, arg2) {
        const ret = makeClosure(arg0, arg1, 237, __wbg_adapter_44);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_closure_wrapper279 = function(arg0, arg1, arg2) {
        const ret = makeClosure(arg0, arg1, 4, __wbg_adapter_38);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_closure_wrapper4672 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 614, __wbg_adapter_47);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_closure_wrapper4818 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 658, __wbg_adapter_50);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_debug_string = function(arg0, arg1) {
        const ret = debugString(getObject(arg1));
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbindgen_error_new = function(arg0, arg1) {
        const ret = new Error(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_is_function = function(arg0) {
        const ret = typeof(getObject(arg0)) === 'function';
        return ret;
    };
    imports.wbg.__wbindgen_is_object = function(arg0) {
        const val = getObject(arg0);
        const ret = typeof(val) === 'object' && val !== null;
        return ret;
    };
    imports.wbg.__wbindgen_is_undefined = function(arg0) {
        const ret = getObject(arg0) === undefined;
        return ret;
    };
    imports.wbg.__wbindgen_memory = function() {
        const ret = wasm.memory;
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_number_new = function(arg0) {
        const ret = arg0;
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_object_clone_ref = function(arg0) {
        const ret = getObject(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
        takeObject(arg0);
    };
    imports.wbg.__wbindgen_rethrow = function(arg0) {
        throw takeObject(arg0);
    };
    imports.wbg.__wbindgen_string_get = function(arg0, arg1) {
        const obj = getObject(arg1);
        const ret = typeof(obj) === 'string' ? obj : undefined;
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
        var len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
        const ret = getStringFromWasm0(arg0, arg1);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbindgen_uint8_array_new = function(arg0, arg1) {
        var v0 = getArrayU8FromWasm0(arg0, arg1).slice();
        wasm.__wbindgen_export_4(arg0, arg1 * 1, 1);
        const ret = v0;
        return addHeapObject(ret);
    };

    return imports;
}

function __wbg_init_memory(imports, memory) {

}

function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedDataViewMemory0 = null;
    cachedUint8ArrayMemory0 = null;


    wasm.__wbindgen_start();
    return wasm;
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (typeof module !== 'undefined') {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module} = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __wbg_get_imports();

    __wbg_init_memory(imports);

    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }

    const instance = new WebAssembly.Instance(module, imports);

    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (typeof module_or_path !== 'undefined') {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }

    if (typeof module_or_path === 'undefined') {
        module_or_path = new URL('casper_delta_wasm_client_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    __wbg_init_memory(imports);

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync };
export default __wbg_init;
