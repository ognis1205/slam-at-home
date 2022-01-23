//
//  RGB.h
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/01/24.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

#ifndef RGB_h
#define RGB_h
  // Placeholder
#endif /* RGB_h */

#import <Foundation/Foundation.h>
#import <WebRTC/WebRTC.h>

@interface RGB : NSObject
+ (UIImage *)fromBuffer:(CMSampleBufferRef)buffer;
+ (UIImage *)fromFrame:(RTCVideoFrame *)frame;
@end
