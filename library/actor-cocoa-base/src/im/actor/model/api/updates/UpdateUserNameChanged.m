//
//  Generated by the J2ObjC translator.  DO NOT EDIT!
//  source: /Users/ex3ndr/Develop/actor-model/library/actor-cocoa-base/build/java/im/actor/model/api/updates/UpdateUserNameChanged.java
//


#include "IOSClass.h"
#include "IOSPrimitiveArray.h"
#include "J2ObjC_source.h"
#include "im/actor/model/api/updates/UpdateUserNameChanged.h"
#include "im/actor/model/droidkit/bser/Bser.h"
#include "im/actor/model/droidkit/bser/BserObject.h"
#include "im/actor/model/droidkit/bser/BserValues.h"
#include "im/actor/model/droidkit/bser/BserWriter.h"
#include "im/actor/model/network/parser/Update.h"
#include "java/io/IOException.h"

@interface APUpdateUserNameChanged () {
 @public
  jint uid_;
  NSString *name_;
}

@end

J2OBJC_FIELD_SETTER(APUpdateUserNameChanged, name_, NSString *)

@implementation APUpdateUserNameChanged

+ (APUpdateUserNameChanged *)fromBytesWithByteArray:(IOSByteArray *)data {
  return APUpdateUserNameChanged_fromBytesWithByteArray_(data);
}

- (instancetype)initWithInt:(jint)uid
               withNSString:(NSString *)name {
  APUpdateUserNameChanged_initWithInt_withNSString_(self, uid, name);
  return self;
}

- (instancetype)init {
  APUpdateUserNameChanged_init(self);
  return self;
}

- (jint)getUid {
  return self->uid_;
}

- (NSString *)getName {
  return self->name_;
}

- (void)parseWithBSBserValues:(BSBserValues *)values {
  self->uid_ = [((BSBserValues *) nil_chk(values)) getIntWithInt:1];
  self->name_ = [values getStringWithInt:2];
}

- (void)serializeWithBSBserWriter:(BSBserWriter *)writer {
  [((BSBserWriter *) nil_chk(writer)) writeIntWithInt:1 withInt:self->uid_];
  if (self->name_ == nil) {
    @throw new_JavaIoIOException_init();
  }
  [writer writeStringWithInt:2 withNSString:self->name_];
}

- (NSString *)description {
  NSString *res = @"update UserNameChanged{";
  res = JreStrcat("$$", res, JreStrcat("$I", @"uid=", self->uid_));
  res = JreStrcat("$$", res, JreStrcat("$$", @", name=", self->name_));
  res = JreStrcat("$C", res, '}');
  return res;
}

- (jint)getHeaderKey {
  return APUpdateUserNameChanged_HEADER;
}

@end

APUpdateUserNameChanged *APUpdateUserNameChanged_fromBytesWithByteArray_(IOSByteArray *data) {
  APUpdateUserNameChanged_initialize();
  return ((APUpdateUserNameChanged *) BSBser_parseWithBSBserObject_withByteArray_(new_APUpdateUserNameChanged_init(), data));
}

void APUpdateUserNameChanged_initWithInt_withNSString_(APUpdateUserNameChanged *self, jint uid, NSString *name) {
  (void) APUpdate_init(self);
  self->uid_ = uid;
  self->name_ = name;
}

APUpdateUserNameChanged *new_APUpdateUserNameChanged_initWithInt_withNSString_(jint uid, NSString *name) {
  APUpdateUserNameChanged *self = [APUpdateUserNameChanged alloc];
  APUpdateUserNameChanged_initWithInt_withNSString_(self, uid, name);
  return self;
}

void APUpdateUserNameChanged_init(APUpdateUserNameChanged *self) {
  (void) APUpdate_init(self);
}

APUpdateUserNameChanged *new_APUpdateUserNameChanged_init() {
  APUpdateUserNameChanged *self = [APUpdateUserNameChanged alloc];
  APUpdateUserNameChanged_init(self);
  return self;
}

J2OBJC_CLASS_TYPE_LITERAL_SOURCE(APUpdateUserNameChanged)
