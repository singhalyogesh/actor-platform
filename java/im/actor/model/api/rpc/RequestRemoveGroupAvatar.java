package im.actor.model.api.rpc;
/*
 *  Generated by the Actor API Scheme generator.  DO NOT EDIT!
 */

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

public class RequestRemoveGroupAvatar extends Request<ResponseSeqDate> {

    public static final int HEADER = 0x65;
    public static RequestRemoveGroupAvatar fromBytes(byte[] data) throws IOException {
        return Bser.parse(new RequestRemoveGroupAvatar(), data);
    }

    private GroupOutPeer groupPeer;
    private long rid;

    public RequestRemoveGroupAvatar(GroupOutPeer groupPeer, long rid) {
        this.groupPeer = groupPeer;
        this.rid = rid;
    }

    public RequestRemoveGroupAvatar() {

    }

    public GroupOutPeer getGroupPeer() {
        return this.groupPeer;
    }

    public long getRid() {
        return this.rid;
    }

    @Override
    public void parse(BserValues values) throws IOException {
        this.groupPeer = values.getObj(1, new GroupOutPeer());
        this.rid = values.getLong(4);
    }

    @Override
    public void serialize(BserWriter writer) throws IOException {
        if (this.groupPeer == null) {
            throw new IOException();
        }
        writer.writeObject(1, this.groupPeer);
        writer.writeLong(4, this.rid);
    }

    @Override
    public String toString() {
        String res = "rpc RemoveGroupAvatar{";
        res += "groupPeer=" + this.groupPeer;
        res += ", rid=" + this.rid;
        res += "}";
        return res;
    }

    @Override
    public int getHeaderKey() {
        return HEADER;
    }
}
