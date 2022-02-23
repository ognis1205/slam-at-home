//
//  RGB.m
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/01/24.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <WebRTC/WebRTC.h>
#include "RGB.h"

#define clamp(a) (a>255?255:(a<0?0:a))

@implementation RGB
+ (UIImage *)fromCMSampleBuffer:(CMSampleBufferRef)sampleBuffer {
  CVImageBufferRef imageBuffer = CMSampleBufferGetImageBuffer(sampleBuffer);
  CVPixelBufferLockBaseAddress(imageBuffer, 0);

  if (CVPixelBufferGetPlaneCount(imageBuffer) < 2) {
    CVPixelBufferUnlockBaseAddress(imageBuffer, 0);
    return nil;
  }
    
  size_t width = CVPixelBufferGetWidth(imageBuffer);
  size_t height = CVPixelBufferGetHeight(imageBuffer);
  uint8_t *yBuffer = CVPixelBufferGetBaseAddressOfPlane(imageBuffer, 0);
  size_t yPitch = CVPixelBufferGetBytesPerRowOfPlane(imageBuffer, 0);
  uint8_t *cbCrBuffer = CVPixelBufferGetBaseAddressOfPlane(imageBuffer, 1);
  size_t cbCrPitch = CVPixelBufferGetBytesPerRowOfPlane(imageBuffer, 1);

  int bytesPerPixel = 4;
  uint8_t *rgbBuffer = malloc(width * height * bytesPerPixel);

  for (int y = 0; y < height; y++) {
    uint8_t *rgbBufferLine = &rgbBuffer[y * width * bytesPerPixel];
    uint8_t *yBufferLine = &yBuffer[y * yPitch];
    uint8_t *cbCrBufferLine = &cbCrBuffer[(y >> 1) * cbCrPitch];

    for (int x = 0; x < width; x++) {
      int16_t y = yBufferLine[x];
      int16_t cb = cbCrBufferLine[x & ~1] - 128;
      int16_t cr = cbCrBufferLine[x | 1] - 128;

      uint8_t *rgbOutput = &rgbBufferLine[x * bytesPerPixel];

      int16_t r = (int16_t)roundf( y + cr *  1.4 );
      int16_t g = (int16_t)roundf( y + cb * -0.343 + cr * -0.711 );
      int16_t b = (int16_t)roundf( y + cb *  1.765);

      rgbOutput[0] = 0xff;
      rgbOutput[1] = clamp(b);
      rgbOutput[2] = clamp(g);
      rgbOutput[3] = clamp(r);
    }
  }
    
  CVPixelBufferUnlockBaseAddress(imageBuffer, 0);

  CGColorSpaceRef colorSpace = CGColorSpaceCreateDeviceRGB();
  CGContextRef context = CGBitmapContextCreate(rgbBuffer, width, height, 8, width * bytesPerPixel, colorSpace, kCGBitmapByteOrder32Little | kCGImageAlphaNoneSkipLast);
    
  CGImageRef cgImage = CGBitmapContextCreateImage(context);
  CGContextRelease(context);
  CGColorSpaceRelease(colorSpace);
  free(rgbBuffer);
    
  UIImage *image = [UIImage imageWithCGImage:cgImage];
  CGImageRelease(cgImage);
    
  return image;
}

+ (UIImage *)fromRTCVideoFrame:(RTCVideoFrame *)frame {
  RTCI420Buffer *buffer = (RTCI420Buffer *)frame.buffer;

  int width = buffer.width;
  int height = buffer.height;
  int bytesPerPixel = 4;
  uint8_t *rgbBuffer = malloc(width * height * bytesPerPixel);

  for (int row = 0; row < height; row++) {
    const uint8_t *yLine = &buffer.dataY[row * buffer.strideY];
    const uint8_t *uLine = &buffer.dataU[(row >> 1) * buffer.strideU];
    const uint8_t *vLine = &buffer.dataV[(row >> 1) * buffer.strideV];

    for (int x = 0; x < width; x++) {
      int16_t y = yLine[x];
      int16_t u = uLine[x >> 1] - 128;
      int16_t v = vLine[x >> 1] - 128;

      int16_t r = roundf(y + v * 1.4);
      int16_t g = roundf(y + u * -0.343 + v * -0.711);
      int16_t b = roundf(y + u * 1.765);

      uint8_t *rgb = &rgbBuffer[(row * width + x) * bytesPerPixel];
      rgb[0] = 0xff;
      rgb[1] = clamp(b);
      rgb[2] = clamp(g);
      rgb[3] = clamp(r);
    }
  }

  CGColorSpaceRef colorSpace = CGColorSpaceCreateDeviceRGB();
  CGContextRef context = CGBitmapContextCreate(rgbBuffer, width, height, 8, width * bytesPerPixel, colorSpace, kCGBitmapByteOrder32Little | kCGImageAlphaNoneSkipLast);

  CGImageRef cgImage = CGBitmapContextCreateImage(context);
  CGContextRelease(context);
  CGColorSpaceRelease(colorSpace);
  free(rgbBuffer);

  UIImage *image = [UIImage imageWithCGImage:cgImage];
  CGImageRelease(cgImage);

  return image;
}

+ (UIImage *)fromRTCI420Buffer:(RTCI420Buffer *)buffer {
  int width = buffer.width;
  int height = buffer.height;
  int bytesPerPixel = 4;
  uint8_t *rgbBuffer = malloc(width * height * bytesPerPixel);

  for (int row = 0; row < height; row++) {
    const uint8_t *yLine = &buffer.dataY[row * buffer.strideY];
    const uint8_t *uLine = &buffer.dataU[(row >> 1) * buffer.strideU];
    const uint8_t *vLine = &buffer.dataV[(row >> 1) * buffer.strideV];

    for (int x = 0; x < width; x++) {
      int16_t y = yLine[x];
      int16_t u = uLine[x >> 1] - 128;
      int16_t v = vLine[x >> 1] - 128;

      int16_t r = roundf(y + v * 1.4);
      int16_t g = roundf(y + u * -0.343 + v * -0.711);
      int16_t b = roundf(y + u * 1.765);

      uint8_t *rgb = &rgbBuffer[(row * width + x) * bytesPerPixel];
      rgb[0] = 0xff;
      rgb[1] = clamp(b);
      rgb[2] = clamp(g);
      rgb[3] = clamp(r);
    }
  }

  CGColorSpaceRef colorSpace = CGColorSpaceCreateDeviceRGB();
  CGContextRef context = CGBitmapContextCreate(rgbBuffer,
                                               width,
                                               height,
                                               8,
                                               width * bytesPerPixel,
                                               colorSpace,
                                               kCGBitmapByteOrder32Little | kCGImageAlphaNoneSkipLast);

  CGImageRef cgImage = CGBitmapContextCreateImage(context);
  CGContextRelease(context);
  CGColorSpaceRelease(colorSpace);
  free(rgbBuffer);

  UIImage *image = [UIImage imageWithCGImage:cgImage];
  CGImageRelease(cgImage);

  return image;
}
@end
