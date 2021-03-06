//
//  IP.m
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/01/23.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

#import <Foundation/Foundation.h>
#include <ifaddrs.h>
#include <arpa/inet.h>
#include "IP.h"

@implementation IP
+ (NSString *) getAddress {
  NSString *address = @"";
  struct ifaddrs *interfaces = NULL;
  struct ifaddrs *addr = NULL;
  if (getifaddrs(&interfaces) == 0) {
    addr = interfaces;
    while (addr != NULL) {
      if(addr->ifa_addr->sa_family == AF_INET) {
        if ([[NSString stringWithUTF8String:addr->ifa_name] isEqualToString:@"en0"]) {
          address = [NSString stringWithUTF8String:inet_ntoa(((struct sockaddr_in *)addr->ifa_addr)->sin_addr)];
        }
      }
      addr = addr->ifa_next;
    }
  }
  freeifaddrs(interfaces);
  return address;
}
@end
