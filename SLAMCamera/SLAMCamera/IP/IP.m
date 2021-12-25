//
//  IP.m
//  SLAMCamera
//
//  Created by Shingo OKAWA on 2021/12/24.
//  Copyright © 2021 Shingo OKAWA. All rights reserved.
//
#import <Foundation/Foundation.h>
#include <ifaddrs.h>
#include <arpa/inet.h>
#include "IP.h"

@implementation IP
/// Returns the device IP address.
+ (NSString *) getAddress {
  NSString *address = @"ip_address_error";
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
