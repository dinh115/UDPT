package uni.hcmus.medicineservice.grpc;

import static io.grpc.MethodDescriptor.generateFullMethodName;

/**
 */
@javax.annotation.Generated(
    value = "by gRPC proto compiler (version 1.58.0)",
    comments = "Source: PrescriptionService.proto")
@io.grpc.stub.annotations.GrpcGenerated
public final class PrescriptionServiceGrpc {

  private PrescriptionServiceGrpc() {}

  public static final java.lang.String SERVICE_NAME = "PrescriptionService";

  // Static method descriptors that strictly reflect the proto.
  private static volatile io.grpc.MethodDescriptor<uni.hcmus.medicineservice.grpc.Empty,
      uni.hcmus.medicineservice.grpc.PrescriptionListResponse> getGetAllPrescriptionsMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "GetAllPrescriptions",
      requestType = uni.hcmus.medicineservice.grpc.Empty.class,
      responseType = uni.hcmus.medicineservice.grpc.PrescriptionListResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<uni.hcmus.medicineservice.grpc.Empty,
      uni.hcmus.medicineservice.grpc.PrescriptionListResponse> getGetAllPrescriptionsMethod() {
    io.grpc.MethodDescriptor<uni.hcmus.medicineservice.grpc.Empty, uni.hcmus.medicineservice.grpc.PrescriptionListResponse> getGetAllPrescriptionsMethod;
    if ((getGetAllPrescriptionsMethod = PrescriptionServiceGrpc.getGetAllPrescriptionsMethod) == null) {
      synchronized (PrescriptionServiceGrpc.class) {
        if ((getGetAllPrescriptionsMethod = PrescriptionServiceGrpc.getGetAllPrescriptionsMethod) == null) {
          PrescriptionServiceGrpc.getGetAllPrescriptionsMethod = getGetAllPrescriptionsMethod =
              io.grpc.MethodDescriptor.<uni.hcmus.medicineservice.grpc.Empty, uni.hcmus.medicineservice.grpc.PrescriptionListResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "GetAllPrescriptions"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  uni.hcmus.medicineservice.grpc.Empty.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  uni.hcmus.medicineservice.grpc.PrescriptionListResponse.getDefaultInstance()))
              .setSchemaDescriptor(new PrescriptionServiceMethodDescriptorSupplier("GetAllPrescriptions"))
              .build();
        }
      }
    }
    return getGetAllPrescriptionsMethod;
  }

  private static volatile io.grpc.MethodDescriptor<uni.hcmus.medicineservice.grpc.PrescriptionIdRequest,
      uni.hcmus.medicineservice.grpc.PrescriptionResponse> getGetPrescriptionByIdMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "GetPrescriptionById",
      requestType = uni.hcmus.medicineservice.grpc.PrescriptionIdRequest.class,
      responseType = uni.hcmus.medicineservice.grpc.PrescriptionResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<uni.hcmus.medicineservice.grpc.PrescriptionIdRequest,
      uni.hcmus.medicineservice.grpc.PrescriptionResponse> getGetPrescriptionByIdMethod() {
    io.grpc.MethodDescriptor<uni.hcmus.medicineservice.grpc.PrescriptionIdRequest, uni.hcmus.medicineservice.grpc.PrescriptionResponse> getGetPrescriptionByIdMethod;
    if ((getGetPrescriptionByIdMethod = PrescriptionServiceGrpc.getGetPrescriptionByIdMethod) == null) {
      synchronized (PrescriptionServiceGrpc.class) {
        if ((getGetPrescriptionByIdMethod = PrescriptionServiceGrpc.getGetPrescriptionByIdMethod) == null) {
          PrescriptionServiceGrpc.getGetPrescriptionByIdMethod = getGetPrescriptionByIdMethod =
              io.grpc.MethodDescriptor.<uni.hcmus.medicineservice.grpc.PrescriptionIdRequest, uni.hcmus.medicineservice.grpc.PrescriptionResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "GetPrescriptionById"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  uni.hcmus.medicineservice.grpc.PrescriptionIdRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  uni.hcmus.medicineservice.grpc.PrescriptionResponse.getDefaultInstance()))
              .setSchemaDescriptor(new PrescriptionServiceMethodDescriptorSupplier("GetPrescriptionById"))
              .build();
        }
      }
    }
    return getGetPrescriptionByIdMethod;
  }

  private static volatile io.grpc.MethodDescriptor<uni.hcmus.medicineservice.grpc.CreatePrescriptionRequest,
      uni.hcmus.medicineservice.grpc.PrescriptionResponse> getCreatePrescriptionMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "CreatePrescription",
      requestType = uni.hcmus.medicineservice.grpc.CreatePrescriptionRequest.class,
      responseType = uni.hcmus.medicineservice.grpc.PrescriptionResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<uni.hcmus.medicineservice.grpc.CreatePrescriptionRequest,
      uni.hcmus.medicineservice.grpc.PrescriptionResponse> getCreatePrescriptionMethod() {
    io.grpc.MethodDescriptor<uni.hcmus.medicineservice.grpc.CreatePrescriptionRequest, uni.hcmus.medicineservice.grpc.PrescriptionResponse> getCreatePrescriptionMethod;
    if ((getCreatePrescriptionMethod = PrescriptionServiceGrpc.getCreatePrescriptionMethod) == null) {
      synchronized (PrescriptionServiceGrpc.class) {
        if ((getCreatePrescriptionMethod = PrescriptionServiceGrpc.getCreatePrescriptionMethod) == null) {
          PrescriptionServiceGrpc.getCreatePrescriptionMethod = getCreatePrescriptionMethod =
              io.grpc.MethodDescriptor.<uni.hcmus.medicineservice.grpc.CreatePrescriptionRequest, uni.hcmus.medicineservice.grpc.PrescriptionResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "CreatePrescription"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  uni.hcmus.medicineservice.grpc.CreatePrescriptionRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  uni.hcmus.medicineservice.grpc.PrescriptionResponse.getDefaultInstance()))
              .setSchemaDescriptor(new PrescriptionServiceMethodDescriptorSupplier("CreatePrescription"))
              .build();
        }
      }
    }
    return getCreatePrescriptionMethod;
  }

  private static volatile io.grpc.MethodDescriptor<uni.hcmus.medicineservice.grpc.UpdatePrescriptionRequest,
      uni.hcmus.medicineservice.grpc.PrescriptionResponse> getUpdatePrescriptionMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "UpdatePrescription",
      requestType = uni.hcmus.medicineservice.grpc.UpdatePrescriptionRequest.class,
      responseType = uni.hcmus.medicineservice.grpc.PrescriptionResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<uni.hcmus.medicineservice.grpc.UpdatePrescriptionRequest,
      uni.hcmus.medicineservice.grpc.PrescriptionResponse> getUpdatePrescriptionMethod() {
    io.grpc.MethodDescriptor<uni.hcmus.medicineservice.grpc.UpdatePrescriptionRequest, uni.hcmus.medicineservice.grpc.PrescriptionResponse> getUpdatePrescriptionMethod;
    if ((getUpdatePrescriptionMethod = PrescriptionServiceGrpc.getUpdatePrescriptionMethod) == null) {
      synchronized (PrescriptionServiceGrpc.class) {
        if ((getUpdatePrescriptionMethod = PrescriptionServiceGrpc.getUpdatePrescriptionMethod) == null) {
          PrescriptionServiceGrpc.getUpdatePrescriptionMethod = getUpdatePrescriptionMethod =
              io.grpc.MethodDescriptor.<uni.hcmus.medicineservice.grpc.UpdatePrescriptionRequest, uni.hcmus.medicineservice.grpc.PrescriptionResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "UpdatePrescription"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  uni.hcmus.medicineservice.grpc.UpdatePrescriptionRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  uni.hcmus.medicineservice.grpc.PrescriptionResponse.getDefaultInstance()))
              .setSchemaDescriptor(new PrescriptionServiceMethodDescriptorSupplier("UpdatePrescription"))
              .build();
        }
      }
    }
    return getUpdatePrescriptionMethod;
  }

  private static volatile io.grpc.MethodDescriptor<uni.hcmus.medicineservice.grpc.PrescriptionIdRequest,
      uni.hcmus.medicineservice.grpc.Empty> getDeletePrescriptionMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "DeletePrescription",
      requestType = uni.hcmus.medicineservice.grpc.PrescriptionIdRequest.class,
      responseType = uni.hcmus.medicineservice.grpc.Empty.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<uni.hcmus.medicineservice.grpc.PrescriptionIdRequest,
      uni.hcmus.medicineservice.grpc.Empty> getDeletePrescriptionMethod() {
    io.grpc.MethodDescriptor<uni.hcmus.medicineservice.grpc.PrescriptionIdRequest, uni.hcmus.medicineservice.grpc.Empty> getDeletePrescriptionMethod;
    if ((getDeletePrescriptionMethod = PrescriptionServiceGrpc.getDeletePrescriptionMethod) == null) {
      synchronized (PrescriptionServiceGrpc.class) {
        if ((getDeletePrescriptionMethod = PrescriptionServiceGrpc.getDeletePrescriptionMethod) == null) {
          PrescriptionServiceGrpc.getDeletePrescriptionMethod = getDeletePrescriptionMethod =
              io.grpc.MethodDescriptor.<uni.hcmus.medicineservice.grpc.PrescriptionIdRequest, uni.hcmus.medicineservice.grpc.Empty>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "DeletePrescription"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  uni.hcmus.medicineservice.grpc.PrescriptionIdRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  uni.hcmus.medicineservice.grpc.Empty.getDefaultInstance()))
              .setSchemaDescriptor(new PrescriptionServiceMethodDescriptorSupplier("DeletePrescription"))
              .build();
        }
      }
    }
    return getDeletePrescriptionMethod;
  }

  /**
   * Creates a new async stub that supports all call types for the service
   */
  public static PrescriptionServiceStub newStub(io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<PrescriptionServiceStub> factory =
      new io.grpc.stub.AbstractStub.StubFactory<PrescriptionServiceStub>() {
        @java.lang.Override
        public PrescriptionServiceStub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
          return new PrescriptionServiceStub(channel, callOptions);
        }
      };
    return PrescriptionServiceStub.newStub(factory, channel);
  }

  /**
   * Creates a new blocking-style stub that supports unary and streaming output calls on the service
   */
  public static PrescriptionServiceBlockingStub newBlockingStub(
      io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<PrescriptionServiceBlockingStub> factory =
      new io.grpc.stub.AbstractStub.StubFactory<PrescriptionServiceBlockingStub>() {
        @java.lang.Override
        public PrescriptionServiceBlockingStub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
          return new PrescriptionServiceBlockingStub(channel, callOptions);
        }
      };
    return PrescriptionServiceBlockingStub.newStub(factory, channel);
  }

  /**
   * Creates a new ListenableFuture-style stub that supports unary calls on the service
   */
  public static PrescriptionServiceFutureStub newFutureStub(
      io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<PrescriptionServiceFutureStub> factory =
      new io.grpc.stub.AbstractStub.StubFactory<PrescriptionServiceFutureStub>() {
        @java.lang.Override
        public PrescriptionServiceFutureStub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
          return new PrescriptionServiceFutureStub(channel, callOptions);
        }
      };
    return PrescriptionServiceFutureStub.newStub(factory, channel);
  }

  /**
   */
  public interface AsyncService {

    /**
     */
    default void getAllPrescriptions(uni.hcmus.medicineservice.grpc.Empty request,
        io.grpc.stub.StreamObserver<uni.hcmus.medicineservice.grpc.PrescriptionListResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getGetAllPrescriptionsMethod(), responseObserver);
    }

    /**
     */
    default void getPrescriptionById(uni.hcmus.medicineservice.grpc.PrescriptionIdRequest request,
        io.grpc.stub.StreamObserver<uni.hcmus.medicineservice.grpc.PrescriptionResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getGetPrescriptionByIdMethod(), responseObserver);
    }

    /**
     */
    default void createPrescription(uni.hcmus.medicineservice.grpc.CreatePrescriptionRequest request,
        io.grpc.stub.StreamObserver<uni.hcmus.medicineservice.grpc.PrescriptionResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getCreatePrescriptionMethod(), responseObserver);
    }

    /**
     */
    default void updatePrescription(uni.hcmus.medicineservice.grpc.UpdatePrescriptionRequest request,
        io.grpc.stub.StreamObserver<uni.hcmus.medicineservice.grpc.PrescriptionResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getUpdatePrescriptionMethod(), responseObserver);
    }

    /**
     */
    default void deletePrescription(uni.hcmus.medicineservice.grpc.PrescriptionIdRequest request,
        io.grpc.stub.StreamObserver<uni.hcmus.medicineservice.grpc.Empty> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getDeletePrescriptionMethod(), responseObserver);
    }
  }

  /**
   * Base class for the server implementation of the service PrescriptionService.
   */
  public static abstract class PrescriptionServiceImplBase
      implements io.grpc.BindableService, AsyncService {

    @java.lang.Override public final io.grpc.ServerServiceDefinition bindService() {
      return PrescriptionServiceGrpc.bindService(this);
    }
  }

  /**
   * A stub to allow clients to do asynchronous rpc calls to service PrescriptionService.
   */
  public static final class PrescriptionServiceStub
      extends io.grpc.stub.AbstractAsyncStub<PrescriptionServiceStub> {
    private PrescriptionServiceStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected PrescriptionServiceStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new PrescriptionServiceStub(channel, callOptions);
    }

    /**
     */
    public void getAllPrescriptions(uni.hcmus.medicineservice.grpc.Empty request,
        io.grpc.stub.StreamObserver<uni.hcmus.medicineservice.grpc.PrescriptionListResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getGetAllPrescriptionsMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     */
    public void getPrescriptionById(uni.hcmus.medicineservice.grpc.PrescriptionIdRequest request,
        io.grpc.stub.StreamObserver<uni.hcmus.medicineservice.grpc.PrescriptionResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getGetPrescriptionByIdMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     */
    public void createPrescription(uni.hcmus.medicineservice.grpc.CreatePrescriptionRequest request,
        io.grpc.stub.StreamObserver<uni.hcmus.medicineservice.grpc.PrescriptionResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getCreatePrescriptionMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     */
    public void updatePrescription(uni.hcmus.medicineservice.grpc.UpdatePrescriptionRequest request,
        io.grpc.stub.StreamObserver<uni.hcmus.medicineservice.grpc.PrescriptionResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getUpdatePrescriptionMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     */
    public void deletePrescription(uni.hcmus.medicineservice.grpc.PrescriptionIdRequest request,
        io.grpc.stub.StreamObserver<uni.hcmus.medicineservice.grpc.Empty> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getDeletePrescriptionMethod(), getCallOptions()), request, responseObserver);
    }
  }

  /**
   * A stub to allow clients to do synchronous rpc calls to service PrescriptionService.
   */
  public static final class PrescriptionServiceBlockingStub
      extends io.grpc.stub.AbstractBlockingStub<PrescriptionServiceBlockingStub> {
    private PrescriptionServiceBlockingStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected PrescriptionServiceBlockingStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new PrescriptionServiceBlockingStub(channel, callOptions);
    }

    /**
     */
    public uni.hcmus.medicineservice.grpc.PrescriptionListResponse getAllPrescriptions(uni.hcmus.medicineservice.grpc.Empty request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getGetAllPrescriptionsMethod(), getCallOptions(), request);
    }

    /**
     */
    public uni.hcmus.medicineservice.grpc.PrescriptionResponse getPrescriptionById(uni.hcmus.medicineservice.grpc.PrescriptionIdRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getGetPrescriptionByIdMethod(), getCallOptions(), request);
    }

    /**
     */
    public uni.hcmus.medicineservice.grpc.PrescriptionResponse createPrescription(uni.hcmus.medicineservice.grpc.CreatePrescriptionRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getCreatePrescriptionMethod(), getCallOptions(), request);
    }

    /**
     */
    public uni.hcmus.medicineservice.grpc.PrescriptionResponse updatePrescription(uni.hcmus.medicineservice.grpc.UpdatePrescriptionRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getUpdatePrescriptionMethod(), getCallOptions(), request);
    }

    /**
     */
    public uni.hcmus.medicineservice.grpc.Empty deletePrescription(uni.hcmus.medicineservice.grpc.PrescriptionIdRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getDeletePrescriptionMethod(), getCallOptions(), request);
    }
  }

  /**
   * A stub to allow clients to do ListenableFuture-style rpc calls to service PrescriptionService.
   */
  public static final class PrescriptionServiceFutureStub
      extends io.grpc.stub.AbstractFutureStub<PrescriptionServiceFutureStub> {
    private PrescriptionServiceFutureStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected PrescriptionServiceFutureStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new PrescriptionServiceFutureStub(channel, callOptions);
    }

    /**
     */
    public com.google.common.util.concurrent.ListenableFuture<uni.hcmus.medicineservice.grpc.PrescriptionListResponse> getAllPrescriptions(
        uni.hcmus.medicineservice.grpc.Empty request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getGetAllPrescriptionsMethod(), getCallOptions()), request);
    }

    /**
     */
    public com.google.common.util.concurrent.ListenableFuture<uni.hcmus.medicineservice.grpc.PrescriptionResponse> getPrescriptionById(
        uni.hcmus.medicineservice.grpc.PrescriptionIdRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getGetPrescriptionByIdMethod(), getCallOptions()), request);
    }

    /**
     */
    public com.google.common.util.concurrent.ListenableFuture<uni.hcmus.medicineservice.grpc.PrescriptionResponse> createPrescription(
        uni.hcmus.medicineservice.grpc.CreatePrescriptionRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getCreatePrescriptionMethod(), getCallOptions()), request);
    }

    /**
     */
    public com.google.common.util.concurrent.ListenableFuture<uni.hcmus.medicineservice.grpc.PrescriptionResponse> updatePrescription(
        uni.hcmus.medicineservice.grpc.UpdatePrescriptionRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getUpdatePrescriptionMethod(), getCallOptions()), request);
    }

    /**
     */
    public com.google.common.util.concurrent.ListenableFuture<uni.hcmus.medicineservice.grpc.Empty> deletePrescription(
        uni.hcmus.medicineservice.grpc.PrescriptionIdRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getDeletePrescriptionMethod(), getCallOptions()), request);
    }
  }

  private static final int METHODID_GET_ALL_PRESCRIPTIONS = 0;
  private static final int METHODID_GET_PRESCRIPTION_BY_ID = 1;
  private static final int METHODID_CREATE_PRESCRIPTION = 2;
  private static final int METHODID_UPDATE_PRESCRIPTION = 3;
  private static final int METHODID_DELETE_PRESCRIPTION = 4;

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
        case METHODID_GET_ALL_PRESCRIPTIONS:
          serviceImpl.getAllPrescriptions((uni.hcmus.medicineservice.grpc.Empty) request,
              (io.grpc.stub.StreamObserver<uni.hcmus.medicineservice.grpc.PrescriptionListResponse>) responseObserver);
          break;
        case METHODID_GET_PRESCRIPTION_BY_ID:
          serviceImpl.getPrescriptionById((uni.hcmus.medicineservice.grpc.PrescriptionIdRequest) request,
              (io.grpc.stub.StreamObserver<uni.hcmus.medicineservice.grpc.PrescriptionResponse>) responseObserver);
          break;
        case METHODID_CREATE_PRESCRIPTION:
          serviceImpl.createPrescription((uni.hcmus.medicineservice.grpc.CreatePrescriptionRequest) request,
              (io.grpc.stub.StreamObserver<uni.hcmus.medicineservice.grpc.PrescriptionResponse>) responseObserver);
          break;
        case METHODID_UPDATE_PRESCRIPTION:
          serviceImpl.updatePrescription((uni.hcmus.medicineservice.grpc.UpdatePrescriptionRequest) request,
              (io.grpc.stub.StreamObserver<uni.hcmus.medicineservice.grpc.PrescriptionResponse>) responseObserver);
          break;
        case METHODID_DELETE_PRESCRIPTION:
          serviceImpl.deletePrescription((uni.hcmus.medicineservice.grpc.PrescriptionIdRequest) request,
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
          getGetAllPrescriptionsMethod(),
          io.grpc.stub.ServerCalls.asyncUnaryCall(
            new MethodHandlers<
              uni.hcmus.medicineservice.grpc.Empty,
              uni.hcmus.medicineservice.grpc.PrescriptionListResponse>(
                service, METHODID_GET_ALL_PRESCRIPTIONS)))
        .addMethod(
          getGetPrescriptionByIdMethod(),
          io.grpc.stub.ServerCalls.asyncUnaryCall(
            new MethodHandlers<
              uni.hcmus.medicineservice.grpc.PrescriptionIdRequest,
              uni.hcmus.medicineservice.grpc.PrescriptionResponse>(
                service, METHODID_GET_PRESCRIPTION_BY_ID)))
        .addMethod(
          getCreatePrescriptionMethod(),
          io.grpc.stub.ServerCalls.asyncUnaryCall(
            new MethodHandlers<
              uni.hcmus.medicineservice.grpc.CreatePrescriptionRequest,
              uni.hcmus.medicineservice.grpc.PrescriptionResponse>(
                service, METHODID_CREATE_PRESCRIPTION)))
        .addMethod(
          getUpdatePrescriptionMethod(),
          io.grpc.stub.ServerCalls.asyncUnaryCall(
            new MethodHandlers<
              uni.hcmus.medicineservice.grpc.UpdatePrescriptionRequest,
              uni.hcmus.medicineservice.grpc.PrescriptionResponse>(
                service, METHODID_UPDATE_PRESCRIPTION)))
        .addMethod(
          getDeletePrescriptionMethod(),
          io.grpc.stub.ServerCalls.asyncUnaryCall(
            new MethodHandlers<
              uni.hcmus.medicineservice.grpc.PrescriptionIdRequest,
              uni.hcmus.medicineservice.grpc.Empty>(
                service, METHODID_DELETE_PRESCRIPTION)))
        .build();
  }

  private static abstract class PrescriptionServiceBaseDescriptorSupplier
      implements io.grpc.protobuf.ProtoFileDescriptorSupplier, io.grpc.protobuf.ProtoServiceDescriptorSupplier {
    PrescriptionServiceBaseDescriptorSupplier() {}

    @java.lang.Override
    public com.google.protobuf.Descriptors.FileDescriptor getFileDescriptor() {
      return uni.hcmus.medicineservice.grpc.PrescriptionServiceProto.getDescriptor();
    }

    @java.lang.Override
    public com.google.protobuf.Descriptors.ServiceDescriptor getServiceDescriptor() {
      return getFileDescriptor().findServiceByName("PrescriptionService");
    }
  }

  private static final class PrescriptionServiceFileDescriptorSupplier
      extends PrescriptionServiceBaseDescriptorSupplier {
    PrescriptionServiceFileDescriptorSupplier() {}
  }

  private static final class PrescriptionServiceMethodDescriptorSupplier
      extends PrescriptionServiceBaseDescriptorSupplier
      implements io.grpc.protobuf.ProtoMethodDescriptorSupplier {
    private final java.lang.String methodName;

    PrescriptionServiceMethodDescriptorSupplier(java.lang.String methodName) {
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
      synchronized (PrescriptionServiceGrpc.class) {
        result = serviceDescriptor;
        if (result == null) {
          serviceDescriptor = result = io.grpc.ServiceDescriptor.newBuilder(SERVICE_NAME)
              .setSchemaDescriptor(new PrescriptionServiceFileDescriptorSupplier())
              .addMethod(getGetAllPrescriptionsMethod())
              .addMethod(getGetPrescriptionByIdMethod())
              .addMethod(getCreatePrescriptionMethod())
              .addMethod(getUpdatePrescriptionMethod())
              .addMethod(getDeletePrescriptionMethod())
              .build();
        }
      }
    }
    return result;
  }
}
