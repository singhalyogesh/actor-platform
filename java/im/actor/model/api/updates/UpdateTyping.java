package im.actor.model.api.updates;
/*
 *  Generated by the Actor API Scheme generator.  DO NOT EDIT!
 */

import im.actor.model.droidkit.bser.Bser;
import im.actor.model.droidkit.bser.BserObject;
import im.actor.model.droidkit.bser.BserValues;
import im.actor.model.droidkit.bser.BserWriter;
import static im.actor.model.droidkit.bser.Utils.*;
import java.io.IOException;
import im.actor.model.network.parser.*;
import java.util.List;
import java.util.ArrayList;
import im.actor.model.api.*;

public class UpdateTyping extends Update {

    public static final int HEADER = 0x6;
    public static UpdateTyping fromBytes(byte[] data) throws IOException {
        return Bser.parse(new UpdateTyping(), data);
    }

    private Peer peer;
    private int uid;
    private TypingType typingType;

    public UpdateTyping(Peer peer, int uid, TypingType typingType) {
        this.peer = peer;
        this.uid = uid;
        this.typingType = typingType;
    }

    public UpdateTyping() {

    }

    public Peer getPeer() {
        return this.peer;
    }

    public int getUid() {
        return this.uid;
    }

    public TypingType getTypingType() {
        return this.typingType;
    }

    @Override
    public void parse(BserValues values) throws IOException {
        this.peer = values.getObj(1, new Peer());
        this.uid = values.getInt(2);
        this.typingType = TypingType.parse(values.getInt(3));
    }

    @Override
    public void serialize(BserWriter writer) throws IOException {
        if (this.peer == null) {
            throw new IOException();
        }
        writer.writeObject(1, this.peer);
        writer.writeInt(2, this.uid);
        if (this.typingType == null) {
            throw new IOException();
        }
        writer.writeInt(3, this.typingType.getValue());
    }

    @Override
    public String toString() {
        String res = "update Typing{";
        res += "peer=" + this.peer;
        res += ", uid=" + this.uid;
        res += ", typingType=" + this.typingType;
        res += "}";
        return res;
    }

    @Override
    public int getHeaderKey() {
        return HEADER;
    }
}
