//
//  RGB.h
//  SLAMCamera
//
//  Created by Shingo OKAWA on 2022/01/02.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

#ifndef RGB_h
#define RGB_h
  // Placeholder
#endif /* RGB_h */

#import <Foundation/Foundation.h>
#import <WebRTC/WebRTC.h>

@interface RGB : NSObject
/// Converts sample buffer to RGB.
+ (UIImage *)fromBuffer:(CMSampleBufferRef)buffer;
/// Converts video frame to RGB.
+ (UIImage *)fromFrame:(RTCVideoFrame *)frame;
@end
