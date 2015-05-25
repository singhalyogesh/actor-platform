package im.actor.model.api.rpc;
/*
 *  Generated by the Actor API Scheme generator.  DO NOT EDIT!
 */

import im.actor.model.droidkit.bser.Bser;
import im.actor.model.droidkit.bser.BserParser;
import im.actor.model.droidkit.bser.BserObject;
import im.actor.model.droidkit.bser.BserValues;
import im.actor.model.droidkit.bser.BserWriter;
import im.actor.model.droidkit.bser.DataInput;
import im.actor.model.droidkit.bser.DataOutput;
import im.actor.model.droidkit.bser.util.SparseArray;
import org.jetbrains.annotations.Nullable;
import org.jetbrains.annotations.NotNull;
import com.google.j2objc.annotations.ObjectiveCName;
import static im.actor.model.droidkit.bser.Utils.*;
import java.io.IOException;
import im.actor.model.network.parser.*;
import java.util.List;
import java.util.ArrayList;
import im.actor.model.api.*;

public class ResponseGetFileUrl extends Response {

    public static final int HEADER = 0x4e;
    public static ResponseGetFileUrl fromBytes(byte[] data) throws IOException {
        return Bser.parse(new ResponseGetFileUrl(), data);
    }

    private String url;
    private int timeout;

    public ResponseGetFileUrl(@NotNull String url, int timeout) {
        this.url = url;
        this.timeout = timeout;
    }

    public ResponseGetFileUrl() {

    }

    @NotNull
    public String getUrl() {
        return this.url;
    }

    public int getTimeout() {
        return this.timeout;
    }

    @Override
    public void parse(BserValues values) throws IOException {
        this.url = values.getString(1);
        this.timeout = values.getInt(2);
    }

    @Override
    public void serialize(BserWriter writer) throws IOException {
        if (this.url == null) {
            throw new IOException();
        }
        writer.writeString(1, this.url);
        writer.writeInt(2, this.timeout);
    }

    @Override
    public String toString() {
        String res = "tuple GetFileUrl{";
        res += "}";
        return res;
    }

    @Override
    public int getHeaderKey() {
        return HEADER;
    }
}
