package uni.hcmus.medicineservice.grpc;

import static io.grpc.MethodDescriptor.generateFullMethodName;

/**
 */
@javax.annotation.Generated(
    value = "by gRPC proto compiler (version 1.58.0)",
    comments = "Source: MedicineService.proto")
@io.grpc.stub.annotations.GrpcGenerated
public final class MedicineServiceGrpc {

  private MedicineServiceGrpc() {}

  public static final java.lang.String SERVICE_NAME = "MedicineService";

  // Static method descriptors that strictly reflect the proto.
  private static volatile io.grpc.MethodDescriptor<uni.hcmus.medicineservice.grpc.Empty,
      uni.hcmus.medicineservice.grpc.MedicineListResponse> getGetAllMedicinesMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "GetAllMedicines",
      requestType = uni.hcmus.medicineservice.grpc.Empty.class,
      responseType = uni.hcmus.medicineservice.grpc.MedicineListResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<uni.hcmus.medicineservice.grpc.Empty,
      uni.hcmus.medicineservice.grpc.MedicineListResponse> getGetAllMedicinesMethod() {
    io.grpc.MethodDescriptor<uni.hcmus.medicineservice.grpc.Empty, uni.hcmus.medicineservice.grpc.MedicineListResponse> getGetAllMedicinesMethod;
    if ((getGetAllMedicinesMethod = MedicineServiceGrpc.getGetAllMedicinesMethod) == null) {
      synchronized (MedicineServiceGrpc.class) {
        if ((getGetAllMedicinesMethod = MedicineServiceGrpc.getGetAllMedicinesMethod) == null) {
          MedicineServiceGrpc.getGetAllMedicinesMethod = getGetAllMedicinesMethod =
              io.grpc.MethodDescriptor.<uni.hcmus.medicineservice.grpc.Empty, uni.hcmus.medicineservice.grpc.MedicineListResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "GetAllMedicines"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  uni.hcmus.medicineservice.grpc.Empty.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  uni.hcmus.medicineservice.grpc.MedicineListResponse.getDefaultInstance()))
              .setSchemaDescriptor(new MedicineServiceMethodDescriptorSupplier("GetAllMedicines"))
              .build();
        }
      }
    }
    return getGetAllMedicinesMethod;
  }

  private static volatile io.grpc.MethodDescriptor<uni.hcmus.medicineservice.grpc.MedicineIdRequest,
      uni.hcmus.medicineservice.grpc.MedicineResponse> getGetMedicineByIdMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "GetMedicineById",
      requestType = uni.hcmus.medicineservice.grpc.MedicineIdRequest.class,
      responseType = uni.hcmus.medicineservice.grpc.MedicineResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<uni.hcmus.medicineservice.grpc.MedicineIdRequest,
      uni.hcmus.medicineservice.grpc.MedicineResponse> getGetMedicineByIdMethod() {
    io.grpc.MethodDescriptor<uni.hcmus.medicineservice.grpc.MedicineIdRequest, uni.hcmus.medicineservice.grpc.MedicineResponse> getGetMedicineByIdMethod;
    if ((getGetMedicineByIdMethod = MedicineServiceGrpc.getGetMedicineByIdMethod) == null) {
      synchronized (MedicineServiceGrpc.class) {
        if ((getGetMedicineByIdMethod = MedicineServiceGrpc.getGetMedicineByIdMethod) == null) {
          MedicineServiceGrpc.getGetMedicineByIdMethod = getGetMedicineByIdMethod =
              io.grpc.MethodDescriptor.<uni.hcmus.medicineservice.grpc.MedicineIdRequest, uni.hcmus.medicineservice.grpc.MedicineResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "GetMedicineById"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  uni.hcmus.medicineservice.grpc.MedicineIdRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  uni.hcmus.medicineservice.grpc.MedicineResponse.getDefaultInstance()))
              .setSchemaDescriptor(new MedicineServiceMethodDescriptorSupplier("GetMedicineById"))
              .build();
        }
      }
    }
    return getGetMedicineByIdMethod;
  }

  private static volatile io.grpc.MethodDescriptor<uni.hcmus.medicineservice.grpc.CreateMedicineRequest,
      uni.hcmus.medicineservice.grpc.MedicineResponse> getCreateMedicineMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "CreateMedicine",
      requestType = uni.hcmus.medicineservice.grpc.CreateMedicineRequest.class,
      responseType = uni.hcmus.medicineservice.grpc.MedicineResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<uni.hcmus.medicineservice.grpc.CreateMedicineRequest,
      uni.hcmus.medicineservice.grpc.MedicineResponse> getCreateMedicineMethod() {
    io.grpc.MethodDescriptor<uni.hcmus.medicineservice.grpc.CreateMedicineRequest, uni.hcmus.medicineservice.grpc.MedicineResponse> getCreateMedicineMethod;
    if ((getCreateMedicineMethod = MedicineServiceGrpc.getCreateMedicineMethod) == null) {
      synchronized (MedicineServiceGrpc.class) {
        if ((getCreateMedicineMethod = MedicineServiceGrpc.getCreateMedicineMethod) == null) {
          MedicineServiceGrpc.getCreateMedicineMethod = getCreateMedicineMethod =
              io.grpc.MethodDescriptor.<uni.hcmus.medicineservice.grpc.CreateMedicineRequest, uni.hcmus.medicineservice.grpc.MedicineResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "CreateMedicine"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  uni.hcmus.medicineservice.grpc.CreateMedicineRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  uni.hcmus.medicineservice.grpc.MedicineResponse.getDefaultInstance()))
              .setSchemaDescriptor(new MedicineServiceMethodDescriptorSupplier("CreateMedicine"))
              .build();
        }
      }
    }
    return getCreateMedicineMethod;
  }

  private static volatile io.grpc.MethodDescriptor<uni.hcmus.medicineservice.grpc.UpdateMedicineRequest,
      uni.hcmus.medicineservice.grpc.MedicineResponse> getUpdateMedicineMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "UpdateMedicine",
      requestType = uni.hcmus.medicineservice.grpc.UpdateMedicineRequest.class,
      responseType = uni.hcmus.medicineservice.grpc.MedicineResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<uni.hcmus.medicineservice.grpc.UpdateMedicineRequest,
      uni.hcmus.medicineservice.grpc.MedicineResponse> getUpdateMedicineMethod() {
    io.grpc.MethodDescriptor<uni.hcmus.medicineservice.grpc.UpdateMedicineRequest, uni.hcmus.medicineservice.grpc.MedicineResponse> getUpdateMedicineMethod;
    if ((getUpdateMedicineMethod = MedicineServiceGrpc.getUpdateMedicineMethod) == null) {
      synchronized (MedicineServiceGrpc.class) {
        if ((getUpdateMedicineMethod = MedicineServiceGrpc.getUpdateMedicineMethod) == null) {
          MedicineServiceGrpc.getUpdateMedicineMethod = getUpdateMedicineMethod =
              io.grpc.MethodDescriptor.<uni.hcmus.medicineservice.grpc.UpdateMedicineRequest, uni.hcmus.medicineservice.grpc.MedicineResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "UpdateMedicine"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  uni.hcmus.medicineservice.grpc.UpdateMedicineRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  uni.hcmus.medicineservice.grpc.MedicineResponse.getDefaultInstance()))
              .setSchemaDescriptor(new MedicineServiceMethodDescriptorSupplier("UpdateMedicine"))
              .build();
        }
      }
    }
    return getUpdateMedicineMethod;
  }

  private static volatile io.grpc.MethodDescriptor<uni.hcmus.medicineservice.grpc.MedicineIdRequest,
      uni.hcmus.medicineservice.grpc.Empty> getDeleteMedicineMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "DeleteMedicine",
      requestType = uni.hcmus.medicineservice.grpc.MedicineIdRequest.class,
      responseType = uni.hcmus.medicineservice.grpc.Empty.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<uni.hcmus.medicineservice.grpc.MedicineIdRequest,
      uni.hcmus.medicineservice.grpc.Empty> getDeleteMedicineMethod() {
    io.grpc.MethodDescriptor<uni.hcmus.medicineservice.grpc.MedicineIdRequest, uni.hcmus.medicineservice.grpc.Empty> getDeleteMedicineMethod;
    if ((getDeleteMedicineMethod = MedicineServiceGrpc.getDeleteMedicineMethod) == null) {
      synchronized (MedicineServiceGrpc.class) {
        if ((getDeleteMedicineMethod = MedicineServiceGrpc.getDeleteMedicineMethod) == null) {
          MedicineServiceGrpc.getDeleteMedicineMethod = getDeleteMedicineMethod =
              io.grpc.MethodDescriptor.<uni.hcmus.medicineservice.grpc.MedicineIdRequest, uni.hcmus.medicineservice.grpc.Empty>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "DeleteMedicine"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  uni.hcmus.medicineservice.grpc.MedicineIdRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  uni.hcmus.medicineservice.grpc.Empty.getDefaultInstance()))
              .setSchemaDescriptor(new MedicineServiceMethodDescriptorSupplier("DeleteMedicine"))
              .build();
        }
      }
    }
    return getDeleteMedicineMethod;
  }

  private static volatile io.grpc.MethodDescriptor<uni.hcmus.medicineservice.grpc.MedicineIdRequest,
      uni.hcmus.medicineservice.grpc.Empty> getRestoreMedicineMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "RestoreMedicine",
      requestType = uni.hcmus.medicineservice.grpc.MedicineIdRequest.class,
      responseType = uni.hcmus.medicineservice.grpc.Empty.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<uni.hcmus.medicineservice.grpc.MedicineIdRequest,
      uni.hcmus.medicineservice.grpc.Empty> getRestoreMedicineMethod() {
    io.grpc.MethodDescriptor<uni.hcmus.medicineservice.grpc.MedicineIdRequest, uni.hcmus.medicineservice.grpc.Empty> getRestoreMedicineMethod;
    if ((getRestoreMedicineMethod = MedicineServiceGrpc.getRestoreMedicineMethod) == null) {
      synchronized (MedicineServiceGrpc.class) {
        if ((getRestoreMedicineMethod = MedicineServiceGrpc.getRestoreMedicineMethod) == null) {
          MedicineServiceGrpc.getRestoreMedicineMethod = getRestoreMedicineMethod =
              io.grpc.MethodDescriptor.<uni.hcmus.medicineservice.grpc.MedicineIdRequest, uni.hcmus.medicineservice.grpc.Empty>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "RestoreMedicine"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  uni.hcmus.medicineservice.grpc.MedicineIdRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  uni.hcmus.medicineservice.grpc.Empty.getDefaultInstance()))
              .setSchemaDescriptor(new MedicineServiceMethodDescriptorSupplier("RestoreMedicine"))
              .build();
        }
      }
    }
    return getRestoreMedicineMethod;
  }

  /**
   * Creates a new async stub that supports all call types for the service
   */
  public static MedicineServiceStub newStub(io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<MedicineServiceStub> factory =
      new io.grpc.stub.AbstractStub.StubFactory<MedicineServiceStub>() {
        @java.lang.Override
        public MedicineServiceStub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
          return new MedicineServiceStub(channel, callOptions);
        }
      };
    return MedicineServiceStub.newStub(factory, channel);
  }

  /**
   * Creates a new blocking-style stub that supports unary and streaming output calls on the service
   */
  public static MedicineServiceBlockingStub newBlockingStub(
      io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<MedicineServiceBlockingStub> factory =
      new io.grpc.stub.AbstractStub.StubFactory<MedicineServiceBlockingStub>() {
        @java.lang.Override
        public MedicineServiceBlockingStub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
          return new MedicineServiceBlockingStub(channel, callOptions);
        }
      };
    return MedicineServiceBlockingStub.newStub(factory, channel);
  }

  /**
   * Creates a new ListenableFuture-style stub that supports unary calls on the service
   */
  public static MedicineServiceFutureStub newFutureStub(
      io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<MedicineServiceFutureStub> factory =
      new io.grpc.stub.AbstractStub.StubFactory<MedicineServiceFutureStub>() {
        @java.lang.Override
        public MedicineServiceFutureStub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
          return new MedicineServiceFutureStub(channel, callOptions);
        }
      };
    return MedicineServiceFutureStub.newStub(factory, channel);
  }

  /**
   */
  public interface AsyncService {

    /**
     */
    default void getAllMedicines(uni.hcmus.medicineservice.grpc.Empty request,
        io.grpc.stub.StreamObserver<uni.hcmus.medicineservice.grpc.MedicineListResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getGetAllMedicinesMethod(), responseObserver);
    }

    /**
     */
    default void getMedicineById(uni.hcmus.medicineservice.grpc.MedicineIdRequest request,
        io.grpc.stub.StreamObserver<uni.hcmus.medicineservice.grpc.MedicineResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getGetMedicineByIdMethod(), responseObserver);
    }

    /**
     */
    default void createMedicine(uni.hcmus.medicineservice.grpc.CreateMedicineRequest request,
        io.grpc.stub.StreamObserver<uni.hcmus.medicineservice.grpc.MedicineResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getCreateMedicineMethod(), responseObserver);
    }

    /**
     */
    default void updateMedicine(uni.hcmus.medicineservice.grpc.UpdateMedicineRequest request,
        io.grpc.stub.StreamObserver<uni.hcmus.medicineservice.grpc.MedicineResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getUpdateMedicineMethod(), responseObserver);
    }

    /**
     */
    default void deleteMedicine(uni.hcmus.medicineservice.grpc.MedicineIdRequest request,
        io.grpc.stub.StreamObserver<uni.hcmus.medicineservice.grpc.Empty> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getDeleteMedicineMethod(), responseObserver);
    }

    /**
     */
    default void restoreMedicine(uni.hcmus.medicineservice.grpc.MedicineIdRequest request,
        io.grpc.stub.StreamObserver<uni.hcmus.medicineservice.grpc.Empty> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getRestoreMedicineMethod(), responseObserver);
    }
  }

  /**
   * Base class for the server implementation of the service MedicineService.
   */
  public static abstract class MedicineServiceImplBase
      implements io.grpc.BindableService, AsyncService {

    @java.lang.Override public final io.grpc.ServerServiceDefinition bindService() {
      return MedicineServiceGrpc.bindService(this);
    }
  }

  /**
   * A stub to allow clients to do asynchronous rpc calls to service MedicineService.
   */
  public static final class MedicineServiceStub
      extends io.grpc.stub.AbstractAsyncStub<MedicineServiceStub> {
    private MedicineServiceStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected MedicineServiceStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new MedicineServiceStub(channel, callOptions);
    }

    /**
     */
    public void getAllMedicines(uni.hcmus.medicineservice.grpc.Empty request,
        io.grpc.stub.StreamObserver<uni.hcmus.medicineservice.grpc.MedicineListResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getGetAllMedicinesMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     */
    public void getMedicineById(uni.hcmus.medicineservice.grpc.MedicineIdRequest request,
        io.grpc.stub.StreamObserver<uni.hcmus.medicineservice.grpc.MedicineResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getGetMedicineByIdMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     */
    public void createMedicine(uni.hcmus.medicineservice.grpc.CreateMedicineRequest request,
        io.grpc.stub.StreamObserver<uni.hcmus.medicineservice.grpc.MedicineResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getCreateMedicineMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     */
    public void updateMedicine(uni.hcmus.medicineservice.grpc.UpdateMedicineRequest request,
        io.grpc.stub.StreamObserver<uni.hcmus.medicineservice.grpc.MedicineResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getUpdateMedicineMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     */
    public void deleteMedicine(uni.hcmus.medicineservice.grpc.MedicineIdRequest request,
        io.grpc.stub.StreamObserver<uni.hcmus.medicineservice.grpc.Empty> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getDeleteMedicineMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     */
    public void restoreMedicine(uni.hcmus.medicineservice.grpc.MedicineIdRequest request,
        io.grpc.stub.StreamObserver<uni.hcmus.medicineservice.grpc.Empty> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getRestoreMedicineMethod(), getCallOptions()), request, responseObserver);
    }
  }

  /**
   * A stub to allow clients to do synchronous rpc calls to service MedicineService.
   */
  public static final class MedicineServiceBlockingStub
      extends io.grpc.stub.AbstractBlockingStub<MedicineServiceBlockingStub> {
    private MedicineServiceBlockingStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected MedicineServiceBlockingStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new MedicineServiceBlockingStub(channel, callOptions);
    }

    /**
     */
    public uni.hcmus.medicineservice.grpc.MedicineListResponse getAllMedicines(uni.hcmus.medicineservice.grpc.Empty request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getGetAllMedicinesMethod(), getCallOptions(), request);
    }

    /**
     */
    public uni.hcmus.medicineservice.grpc.MedicineResponse getMedicineById(uni.hcmus.medicineservice.grpc.MedicineIdRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getGetMedicineByIdMethod(), getCallOptions(), request);
    }

    /**
     */
    public uni.hcmus.medicineservice.grpc.MedicineResponse createMedicine(uni.hcmus.medicineservice.grpc.CreateMedicineRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getCreateMedicineMethod(), getCallOptions(), request);
    }

    /**
     */
    public uni.hcmus.medicineservice.grpc.MedicineResponse updateMedicine(uni.hcmus.medicineservice.grpc.UpdateMedicineRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getUpdateMedicineMethod(), getCallOptions(), request);
    }

    /**
     */
    public uni.hcmus.medicineservice.grpc.Empty deleteMedicine(uni.hcmus.medicineservice.grpc.MedicineIdRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getDeleteMedicineMethod(), getCallOptions(), request);
    }

    /**
     */
    public uni.hcmus.medicineservice.grpc.Empty restoreMedicine(uni.hcmus.medicineservice.grpc.MedicineIdRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getRestoreMedicineMethod(), getCallOptions(), request);
    }
  }

  /**
   * A stub to allow clients to do ListenableFuture-style rpc calls to service MedicineService.
   */
  public static final class MedicineServiceFutureStub
      extends io.grpc.stub.AbstractFutureStub<MedicineServiceFutureStub> {
    private MedicineServiceFutureStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected MedicineServiceFutureStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new MedicineServiceFutureStub(channel, callOptions);
    }

    /**
     */
    public com.google.common.util.concurrent.ListenableFuture<uni.hcmus.medicineservice.grpc.MedicineListResponse> getAllMedicines(
        uni.hcmus.medicineservice.grpc.Empty request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getGetAllMedicinesMethod(), getCallOptions()), request);
    }

    /**
     */
    public com.google.common.util.concurrent.ListenableFuture<uni.hcmus.medicineservice.grpc.MedicineResponse> getMedicineById(
        uni.hcmus.medicineservice.grpc.MedicineIdRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getGetMedicineByIdMethod(), getCallOptions()), request);
    }

    /**
     */
    public com.google.common.util.concurrent.ListenableFuture<uni.hcmus.medicineservice.grpc.MedicineResponse> createMedicine(
        uni.hcmus.medicineservice.grpc.CreateMedicineRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getCreateMedicineMethod(), getCallOptions()), request);
    }

    /**
     */
    public com.google.common.util.concurrent.ListenableFuture<uni.hcmus.medicineservice.grpc.MedicineResponse> updateMedicine(
        uni.hcmus.medicineservice.grpc.UpdateMedicineRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getUpdateMedicineMethod(), getCallOptions()), request);
    }

    /**
     */
    public com.google.common.util.concurrent.ListenableFuture<uni.hcmus.medicineservice.grpc.Empty> deleteMedicine(
        uni.hcmus.medicineservice.grpc.MedicineIdRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getDeleteMedicineMethod(), getCallOptions()), request);
    }

    /**
     */
    public com.google.common.util.concurrent.ListenableFuture<uni.hcmus.medicineservice.grpc.Empty> restoreMedicine(
        uni.hcmus.medicineservice.grpc.MedicineIdRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getRestoreMedicineMethod(), getCallOptions()), request);
    }
  }

  private static final int METHODID_GET_ALL_MEDICINES = 0;
  private static final int METHODID_GET_MEDICINE_BY_ID = 1;
  private static final int METHODID_CREATE_MEDICINE = 2;
  private static final int METHODID_UPDATE_MEDICINE = 3;
  private static final int METHODID_DELETE_MEDICINE = 4;
  private static final int METHODID_RESTORE_MEDICINE = 5;

  private static final class MethodHandlers<Req, Resp> implements
      io.grpc.stub.ServerCalls.UnaryMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.ServerStreamingMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.ClientStreamingMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.BidiStreamingMethod<Req, Resp> {
    private final AsyncService serviceImpl;
    private final int methodId;

    MethodHandlers(AsyncService serviceImpl, int methodId) {
      this.serviceImpl = serviceImpl;
      this.methodId = methodId;
    }

    @java.lang.Override
    @java.lang.SuppressWarnings("unchecked")
    public void invoke(Req request, io.grpc.stub.StreamObserver<Resp> responseObserver) {
      switch (methodId) {
        case METHODID_GET_ALL_MEDICINES:
          serviceImpl.getAllMedicines((uni.hcmus.medicineservice.grpc.Empty) request,
              (io.grpc.stub.StreamObserver<uni.hcmus.medicineservice.grpc.MedicineListResponse>) responseObserver);
          break;
        case METHODID_GET_MEDICINE_BY_ID:
          serviceImpl.getMedicineById((uni.hcmus.medicineservice.grpc.MedicineIdRequest) request,
              (io.grpc.stub.StreamObserver<uni.hcmus.medicineservice.grpc.MedicineResponse>) responseObserver);
          break;
        case METHODID_CREATE_MEDICINE:
          serviceImpl.createMedicine((uni.hcmus.medicineservice.grpc.CreateMedicineRequest) request,
              (io.grpc.stub.StreamObserver<uni.hcmus.medicineservice.grpc.MedicineResponse>) responseObserver);
          break;
        case METHODID_UPDATE_MEDICINE:
          serviceImpl.updateMedicine((uni.hcmus.medicineservice.grpc.UpdateMedicineRequest) request,
              (io.grpc.stub.StreamObserver<uni.hcmus.medicineservice.grpc.MedicineResponse>) responseObserver);
          break;
        case METHODID_DELETE_MEDICINE:
          serviceImpl.deleteMedicine((uni.hcmus.medicineservice.grpc.MedicineIdRequest) request,
              (io.grpc.stub.StreamObserver<uni.hcmus.medicineservice.grpc.Empty>) responseObserver);
          break;
        case METHODID_RESTORE_MEDICINE:
          serviceImpl.restoreMedicine((uni.hcmus.medicineservice.grpc.MedicineIdRequest) request,
              (io.grpc.stub.StreamObserver<uni.hcmus.medicineservice.grpc.Empty>) responseObserver);
          break;
        default:
          throw new AssertionError();
      }
    }

    @java.lang.Override
    @java.lang.SuppressWarnings("unchecked")
    public io.grpc.stub.StreamObserver<Req> invoke(
        io.grpc.stub.StreamObserver<Resp> responseObserver) {
      switch (methodId) {
        default:
          throw new AssertionError();
      }
    }
  }

  public static final io.grpc.ServerServiceDefinition bindService(AsyncService service) {
    return io.grpc.ServerServiceDefinition.builder(getServiceDescriptor())
        .addMethod(
          getGetAllMedicinesMethod(),
          io.grpc.stub.ServerCalls.asyncUnaryCall(
            new MethodHandlers<
              uni.hcmus.medicineservice.grpc.Empty,
              uni.hcmus.medicineservice.grpc.MedicineListResponse>(
                service, METHODID_GET_ALL_MEDICINES)))
        .addMethod(
          getGetMedicineByIdMethod(),
          io.grpc.stub.ServerCalls.asyncUnaryCall(
            new MethodHandlers<
              uni.hcmus.medicineservice.grpc.MedicineIdRequest,
              uni.hcmus.medicineservice.grpc.MedicineResponse>(
                service, METHODID_GET_MEDICINE_BY_ID)))
        .addMethod(
          getCreateMedicineMethod(),
          io.grpc.stub.ServerCalls.asyncUnaryCall(
            new MethodHandlers<
              uni.hcmus.medicineservice.grpc.CreateMedicineRequest,
              uni.hcmus.medicineservice.grpc.MedicineResponse>(
                service, METHODID_CREATE_MEDICINE)))
        .addMethod(
          getUpdateMedicineMethod(),
          io.grpc.stub.ServerCalls.asyncUnaryCall(
            new MethodHandlers<
              uni.hcmus.medicineservice.grpc.UpdateMedicineRequest,
              uni.hcmus.medicineservice.grpc.MedicineResponse>(
                service, METHODID_UPDATE_MEDICINE)))
        .addMethod(
          getDeleteMedicineMethod(),
          io.grpc.stub.ServerCalls.asyncUnaryCall(
            new MethodHandlers<
              uni.hcmus.medicineservice.grpc.MedicineIdRequest,
              uni.hcmus.medicineservice.grpc.Empty>(
                service, METHODID_DELETE_MEDICINE)))
        .addMethod(
          getRestoreMedicineMethod(),
          io.grpc.stub.ServerCalls.asyncUnaryCall(
            new MethodHandlers<
              uni.hcmus.medicineservice.grpc.MedicineIdRequest,
              uni.hcmus.medicineservice.grpc.Empty>(
                service, METHODID_RESTORE_MEDICINE)))
        .build();
  }

  private static abstract class MedicineServiceBaseDescriptorSupplier
      implements io.grpc.protobuf.ProtoFileDescriptorSupplier, io.grpc.protobuf.ProtoServiceDescriptorSupplier {
    MedicineServiceBaseDescriptorSupplier() {}

    @java.lang.Override
    public com.google.protobuf.Descriptors.FileDescriptor getFileDescriptor() {
      return uni.hcmus.medicineservice.grpc.MedicineServiceProto.getDescriptor();
    }

    @java.lang.Override
    public com.google.protobuf.Descriptors.ServiceDescriptor getServiceDescriptor() {
      return getFileDescriptor().findServiceByName("MedicineService");
    }
  }

  private static final class MedicineServiceFileDescriptorSupplier
      extends MedicineServiceBaseDescriptorSupplier {
    MedicineServiceFileDescriptorSupplier() {}
  }

  private static final class MedicineServiceMethodDescriptorSupplier
      extends MedicineServiceBaseDescriptorSupplier
      implements io.grpc.protobuf.ProtoMethodDescriptorSupplier {
    private final java.lang.String methodName;

    MedicineServiceMethodDescriptorSupplier(java.lang.String methodName) {
      this.methodName = methodName;
    }

    @java.lang.Override
    public com.google.protobuf.Descriptors.MethodDescriptor getMethodDescriptor() {
      return getServiceDescriptor().findMethodByName(methodName);
    }
  }

  private static volatile io.grpc.ServiceDescriptor serviceDescriptor;

  public static io.grpc.ServiceDescriptor getServiceDescriptor() {
    io.grpc.ServiceDescriptor result = serviceDescriptor;
    if (result == null) {
      synchronized (MedicineServiceGrpc.class) {
        result = serviceDescriptor;
        if (result == null) {
          serviceDescriptor = result = io.grpc.ServiceDescriptor.newBuilder(SERVICE_NAME)
              .setSchemaDescriptor(new MedicineServiceFileDescriptorSupplier())
              .addMethod(getGetAllMedicinesMethod())
              .addMethod(getGetMedicineByIdMethod())
              .addMethod(getCreateMedicineMethod())
              .addMethod(getUpdateMedicineMethod())
              .addMethod(getDeleteMedicineMethod())
              .addMethod(getRestoreMedicineMethod())
              .build();
        }
      }
    }
    return result;
  }
}
