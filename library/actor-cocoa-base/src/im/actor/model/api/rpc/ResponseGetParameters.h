//
//  Generated by the J2ObjC translator.  DO NOT EDIT!
//  source: /Users/ex3ndr/Develop/actor-model/library/actor-cocoa-base/build/java/im/actor/model/api/rpc/ResponseGetParameters.java
//

#ifndef _APResponseGetParameters_H_
#define _APResponseGetParameters_H_

#include "J2ObjC_header.h"
#include "im/actor/model/network/parser/Response.h"

@class BSBserValues;
@class BSBserWriter;
@class IOSByteArray;
@protocol JavaUtilList;

#define APResponseGetParameters_HEADER 135

@interface APResponseGetParameters : APResponse

#pragma mark Public

- (instancetype)init;

- (instancetype)initWithJavaUtilList:(id<JavaUtilList>)parameters;

+ (APResponseGetParameters *)fromBytesWithByteArray:(IOSByteArray *)data;

- (jint)getHeaderKey;

- (id<JavaUtilList>)getParameters;

- (void)parseWithBSBserValues:(BSBserValues *)values;

- (void)serializeWithBSBserWriter:(BSBserWriter *)writer;

- (NSString *)description;

@end

J2OBJC_EMPTY_STATIC_INIT(APResponseGetParameters)

J2OBJC_STATIC_FIELD_GETTER(APResponseGetParameters, HEADER, jint)

FOUNDATION_EXPORT APResponseGetParameters *APResponseGetParameters_fromBytesWithByteArray_(IOSByteArray *data);

FOUNDATION_EXPORT void APResponseGetParameters_initWithJavaUtilList_(APResponseGetParameters *self, id<JavaUtilList> parameters);

FOUNDATION_EXPORT APResponseGetParameters *new_APResponseGetParameters_initWithJavaUtilList_(id<JavaUtilList> parameters) NS_RETURNS_RETAINED;

FOUNDATION_EXPORT void APResponseGetParameters_init(APResponseGetParameters *self);

FOUNDATION_EXPORT APResponseGetParameters *new_APResponseGetParameters_init() NS_RETURNS_RETAINED;

J2OBJC_TYPE_LITERAL_HEADER(APResponseGetParameters)

typedef APResponseGetParameters ImActorModelApiRpcResponseGetParameters;

#endif // _APResponseGetParameters_H_
