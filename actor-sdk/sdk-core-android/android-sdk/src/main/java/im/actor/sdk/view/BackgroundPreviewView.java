package im.actor.sdk.view;

import android.content.Context;
import android.net.Uri;
import android.util.AttributeSet;

import com.facebook.common.util.UriUtil;
import com.facebook.drawee.backends.pipeline.Fresco;
import com.facebook.drawee.backends.pipeline.PipelineDraweeController;
import com.facebook.drawee.generic.GenericDraweeHierarchy;
import com.facebook.drawee.generic.GenericDraweeHierarchyBuilder;
import com.facebook.drawee.view.SimpleDraweeView;
import com.facebook.imagepipeline.common.ResizeOptions;
import com.facebook.imagepipeline.request.ImageRequest;
import com.facebook.imagepipeline.request.ImageRequestBuilder;

import im.actor.sdk.ActorSDK;
import im.actor.sdk.R;

public class BackgroundPreviewView extends SimpleDraweeView {

    private int width;
    private int height;
    private static final int[] BACKGROUNDS = ActorSDK.sharedActor().style.getDefaultBackgrouds();

    public BackgroundPreviewView(Context context, GenericDraweeHierarchy hierarchy) {
        super(context, hierarchy);
    }

    public BackgroundPreviewView(Context context) {
        super(context);
    }

    public BackgroundPreviewView(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    public BackgroundPreviewView(Context context, AttributeSet attrs, int defStyle) {
        super(context, attrs, defStyle);
    }

    public void init(int width, int height) {
        this.width = width;
        this.height = height;

        GenericDraweeHierarchyBuilder builder =
                new GenericDraweeHierarchyBuilder(getResources());

        GenericDraweeHierarchy hierarchy = builder
                .setFadeDuration(200)
                .build();
        setHierarchy(hierarchy);
    }

    public void bind(int i) {
        int bkgrnd = getBackground(i);
        Uri uri = new Uri.Builder()
                .scheme(UriUtil.LOCAL_RESOURCE_SCHEME)
                .path(String.valueOf(bkgrnd))
                .build();
        ImageRequest request = ImageRequestBuilder.newBuilderWithSource(uri)
                .setResizeOptions(new ResizeOptions(width, height))
                .build();
        PipelineDraweeController controller = (PipelineDraweeController) Fresco.newDraweeControllerBuilder()
                .setOldController(getController())
                .setImageRequest(request)
                .build();
        setController(controller);

    }


    public static int getBackground(int i) {
        if (i >= 0 && BACKGROUNDS.length > i) {
            return BACKGROUNDS[i];
        } else {
            return BACKGROUNDS[0];
        }
    }

    public static int getSize() {
        return BACKGROUNDS.length;
    }
}