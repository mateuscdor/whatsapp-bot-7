"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const baileys_1 = __importStar(require("@adiwajshing/baileys"));
const logger_1 = __importDefault(require("@adiwajshing/baileys/lib/Utils/logger"));
const logger = logger_1.default.child({});
logger.level = 'trace';
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const { state } = yield (0, baileys_1.useMultiFileAuthState)('baileys_auth_info');
    const sock = (0, baileys_1.default)({
        auth: state,
        logger,
        printQRInTerminal: true
    });
    sock.ev.process((events) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const messageUpsert = events['messages.upsert'];
        console.log(messageUpsert);
        if (messageUpsert && messageUpsert.type === 'notify') {
            for (const msg of messageUpsert.messages) {
                const conversation = (_a = msg.message) === null || _a === void 0 ? void 0 : _a.conversation;
                if ((conversation === null || conversation === void 0 ? void 0 : conversation.toLowerCase()) === 'p') {
                    const sections = [
                        {
                            rows: [
                                {
                                    title: "Bagaimana cara saya memesan?"
                                },
                                {
                                    title: "Saya memiliki kendala"
                                },
                                {
                                    title: "Barang tidak sampai"
                                }
                            ]
                        }
                    ];
                    const listMessage = {
                        text: "Hai, ada yang bisa kami bantu?",
                        buttonText: "FAQ",
                        sections
                    };
                    const sendMsg = yield sock.sendMessage(msg.key.remoteJid, listMessage);
                    console.log(msg);
                    console.log(sendMsg);
                }
                else if (conversation === "Bagaimana cara saya memesan?") {
                    yield sock.sendMessage(msg.key.remoteJid, { text: "Anda bisa langsung memesan dengan ..." });
                }
                else if (conversation === "Saya memiliki kendala") {
                    yield sock.sendMessage(msg.key.remoteJid, { text: "Jika anda memiliki kendala, silahkan hubungi ..." });
                }
                else if (conversation === "Barang tidak sampai") {
                    yield sock.sendMessage(msg.key.remoteJid, { text: "Anda bisa menghubungi ..." });
                }
            }
        }
    }));
});
main();
